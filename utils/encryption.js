const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Data Encryption and Security Utilities
class EncryptionService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32; // 256 bits
        this.ivLength = 16;  // 128 bits
        this.tagLength = 16; // 128 bits
        this.saltRounds = 12;
        
        // Get encryption key from environment or generate one
        this.encryptionKey = process.env.ENCRYPTION_KEY 
            ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
            : this.generateKey();
            
        if (!process.env.ENCRYPTION_KEY) {
            console.warn('⚠️  No ENCRYPTION_KEY found in environment. Using generated key (data will not persist across restarts)');
            console.log('Generated key (save this to ENCRYPTION_KEY):', this.encryptionKey.toString('hex'));
        }
    }

    // Generate a new encryption key
    generateKey() {
        return crypto.randomBytes(this.keyLength);
    }

    // Encrypt sensitive data
    encrypt(text) {
        try {
            if (!text) return null;
            
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv, { authTagLength: this.tagLength });
            cipher.setAAD(Buffer.from('blockchain-traceability'));

            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            const tag = cipher.getAuthTag();
            
            // Combine iv + tag + encrypted data
            const result = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
            return result;
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt data');
        }
    }

    // Decrypt sensitive data
    decrypt(encryptedData) {
        try {
            if (!encryptedData) return null;
            
            const parts = encryptedData.split(':');
            if (parts.length !== 3) {
                throw new Error('Invalid encrypted data format');
            }
            
            const iv = Buffer.from(parts[0], 'hex');
            const tag = Buffer.from(parts[1], 'hex');
            const encrypted = parts[2];
            
            const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv, { authTagLength: this.tagLength });
            decipher.setAAD(Buffer.from('blockchain-traceability'));
            decipher.setAuthTag(tag);

            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data');
        }
    }

    // Hash passwords securely
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            console.error('Password hashing error:', error);
            throw new Error('Failed to hash password');
        }
    }

    // Verify password against hash
    async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Password verification error:', error);
            return false;
        }
    }

    // Generate secure random tokens
    generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    // Generate API keys
    generateApiKey() {
        const timestamp = Date.now().toString();
        const randomBytes = crypto.randomBytes(16).toString('hex');
        return `btrace_${timestamp}_${randomBytes}`;
    }

    // Create HMAC signature for data integrity
    createSignature(data, secret = null) {
        const key = secret || this.encryptionKey;
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(JSON.stringify(data));
        return hmac.digest('hex');
    }

    // Verify HMAC signature
    verifySignature(data, signature, secret = null) {
        const expectedSignature = this.createSignature(data, secret);
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    }

    // Encrypt sensitive product data
    encryptProductData(productData) {
        const sensitiveFields = ['farmerPhone', 'farmerEmail', 'location', 'gpsCoordinates'];
        const encrypted = { ...productData };
        
        sensitiveFields.forEach(field => {
            if (encrypted[field]) {
                encrypted[field] = this.encrypt(encrypted[field]);
            }
        });
        
        return encrypted;
    }

    // Decrypt sensitive product data
    decryptProductData(encryptedProductData) {
        const sensitiveFields = ['farmerPhone', 'farmerEmail', 'location', 'gpsCoordinates'];
        const decrypted = { ...encryptedProductData };
        
        sensitiveFields.forEach(field => {
            if (decrypted[field]) {
                try {
                    decrypted[field] = this.decrypt(decrypted[field]);
                } catch (error) {
                    console.error(`Failed to decrypt field ${field}:`, error);
                    decrypted[field] = '[ENCRYPTED]';
                }
            }
        });
        
        return decrypted;
    }

    // Generate secure session tokens
    generateSessionToken(userId, expiryHours = 24) {
        const payload = {
            userId,
            issued: Date.now(),
            expires: Date.now() + (expiryHours * 60 * 60 * 1000),
            nonce: this.generateToken(16)
        };
        
        const token = Buffer.from(JSON.stringify(payload)).toString('base64');
        const signature = this.createSignature(payload);
        
        return `${token}.${signature}`;
    }

    // Verify session token
    verifySessionToken(token) {
        try {
            const [tokenPart, signature] = token.split('.');
            if (!tokenPart || !signature) {
                return { valid: false, error: 'Invalid token format' };
            }
            
            const payload = JSON.parse(Buffer.from(tokenPart, 'base64').toString());
            
            // Verify signature
            if (!this.verifySignature(payload, signature)) {
                return { valid: false, error: 'Invalid signature' };
            }
            
            // Check expiry
            if (Date.now() > payload.expires) {
                return { valid: false, error: 'Token expired' };
            }
            
            return { valid: true, payload };
        } catch (error) {
            return { valid: false, error: 'Token verification failed' };
        }
    }

    // Sanitize data for logging (remove sensitive information)
    sanitizeForLogging(data) {
        const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key/i,
            /token/i,
            /phone/i,
            /email/i,
            /address/i
        ];
        
        const sanitized = JSON.parse(JSON.stringify(data));
        
        const sanitizeObject = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]);
                } else if (typeof obj[key] === 'string') {
                    // Check if key matches sensitive patterns
                    const isSensitive = sensitivePatterns.some(pattern => pattern.test(key));
                    if (isSensitive) {
                        obj[key] = '[REDACTED]';
                    }
                }
            }
        };
        
        sanitizeObject(sanitized);
        return sanitized;
    }

    // Generate secure QR code data with integrity check
    generateSecureQRData(productId, additionalData = {}) {
        const qrPayload = {
            productId,
            timestamp: Date.now(),
            ...additionalData
        };
        
        const signature = this.createSignature(qrPayload);
        const secureData = {
            ...qrPayload,
            signature
        };
        
        return Buffer.from(JSON.stringify(secureData)).toString('base64');
    }

    // Verify QR code data integrity
    verifyQRData(qrData) {
        try {
            const decoded = JSON.parse(Buffer.from(qrData, 'base64').toString());
            const { signature, ...payload } = decoded;
            
            if (!this.verifySignature(payload, signature)) {
                return { valid: false, error: 'QR code signature invalid' };
            }
            
            // Check if QR code is not too old (24 hours)
            const maxAge = 24 * 60 * 60 * 1000;
            if (Date.now() - payload.timestamp > maxAge) {
                return { valid: false, error: 'QR code expired' };
            }
            
            return { valid: true, data: payload };
        } catch (error) {
            return { valid: false, error: 'Invalid QR code format' };
        }
    }
}

// Security Headers Middleware
const securityHeaders = (req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Strict transport security (HTTPS only)
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob:; " +
        "connect-src 'self'; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "media-src 'self'; " +
        "frame-src 'none';"
    );
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    next();
};

// Input validation and sanitization
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};

// Rate limiting for sensitive operations
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const key = req.ip || 'unknown';
        const now = Date.now();
        
        if (!requests.has(key)) {
            requests.set(key, []);
        }
        
        const userRequests = requests.get(key);
        
        // Remove old requests outside the window
        const validRequests = userRequests.filter(time => now - time < windowMs);
        requests.set(key, validRequests);
        
        if (validRequests.length >= max) {
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
        
        validRequests.push(now);
        next();
    };
};

module.exports = { EncryptionService, securityHeaders, sanitizeInput, createRateLimiter };
