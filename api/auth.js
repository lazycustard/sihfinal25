const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger.js');
const { EncryptionService } = require('../utils/encryption.js');

const router = express.Router();
const encryptionService = new EncryptionService();

// In-memory user storage (replace with database in production)
const users = new Map();

// Default admin user
const defaultAdmin = {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@agritrace.gov.in',
    password: '$2b$12$LQv3c1yqBwEHFl5aysHdsO.rWISaG83FEl5d2IAiAXtkOC9QCC6Zq', // password: admin123
    role: 'admin',
    phone: '+91-9999999999',
    createdAt: new Date().toISOString(),
    isActive: true
};
users.set('admin', defaultAdmin);

// Demo users for testing
const demoUsers = [
    {
        id: 'farmer-001',
        username: 'farmer1',
        email: 'farmer1@example.com',
        password: '$2b$12$LQv3c1yqBwEHFl5aysHdsO.rWISaG83FEl5d2IAiAXtkOC9QCC6Zq', // password: demo123
        role: 'farmer',
        phone: '+91-9876543210',
        createdAt: new Date().toISOString(),
        isActive: true
    },
    {
        id: 'distributor-001',
        username: 'distributor1',
        email: 'distributor1@example.com',
        password: '$2b$12$LQv3c1yqBwEHFl5aysHdsO.rWISaG83FEl5d2IAiAXtkOC9QCC6Zq', // password: demo123
        role: 'distributor',
        phone: '+91-9876543211',
        createdAt: new Date().toISOString(),
        isActive: true
    },
    {
        id: 'retailer-001',
        username: 'retailer1',
        email: 'retailer1@example.com',
        password: '$2b$12$LQv3c1yqBwEHFl5aysHdsO.rWISaG83FEl5d2IAiAXtkOC9QCC6Zq', // password: demo123
        role: 'retailer',
        phone: '+91-9876543212',
        createdAt: new Date().toISOString(),
        isActive: true
    },
    {
        id: 'consumer-001',
        username: 'consumer1',
        email: 'consumer1@example.com',
        password: '$2b$12$LQv3c1yqBwEHFl5aysHdsO.rWISaG83FEl5d2IAiAXtkOC9QCC6Zq', // password: demo123
        role: 'consumer',
        phone: '+91-9876543213',
        createdAt: new Date().toISOString(),
        isActive: true
    }
];

// Add demo users
demoUsers.forEach(user => {
    users.set(user.username, user);
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'blockchain-traceability-secret-key';

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        // Validation
        if (!username || !email || !password || !phone || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        if (users.has(username)) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Check if email already exists
        for (const user of users.values()) {
            if (user.email === email) {
                return res.status(409).json({ error: 'Email already exists' });
            }
        }

        // Validate role
        const validRoles = ['farmer', 'distributor', 'retailer', 'consumer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            role,
            phone,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        // Store user
        users.set(username, newUser);

        logger.info('New user registered', { username, role, email });

        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = users.get(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        user.lastLogin = new Date().toISOString();

        logger.info('User logged in', { username, role: user.role });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Role-based access control middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const user = users.get(req.user.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        logger.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { email, phone } = req.body;
        const user = users.get(req.user.username);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update allowed fields
        if (email) user.email = email;
        if (phone) user.phone = phone;
        user.updatedAt = new Date().toISOString();

        logger.info('User profile updated', { username: user.username });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        logger.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }

        const user = users.get(req.user.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;
        user.updatedAt = new Date().toISOString();

        logger.info('Password changed', { username: user.username });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        logger.error('Password change error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
    logger.info('User logged out', { username: req.user.username });
    res.json({ message: 'Logged out successfully' });
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireRole(['admin']), (req, res) => {
    try {
        const userList = Array.from(users.values()).map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            isActive: user.isActive
        }));

        res.json({ users: userList });
    } catch (error) {
        logger.error('Users fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Demo credentials endpoint
router.get('/demo-credentials', (req, res) => {
    const demoCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'farmer1', password: 'demo123', role: 'farmer' },
        { username: 'distributor1', password: 'demo123', role: 'distributor' },
        { username: 'retailer1', password: 'demo123', role: 'retailer' },
        { username: 'consumer1', password: 'demo123', role: 'consumer' }
    ];

    res.json({ 
        message: 'Demo credentials for testing',
        credentials: demoCredentials 
    });
});

module.exports = { authRouter: router, authenticateToken, requireRole };
