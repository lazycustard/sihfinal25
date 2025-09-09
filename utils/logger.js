const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Custom log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (stack) log += `\nStack: ${stack}`;
        if (Object.keys(meta).length > 0) log += `\nMeta: ${JSON.stringify(meta)}`;
        return log;
    })
);

// Ensure logs directory exists before initializing file transports
const logsDir = path.join(__dirname, '..', 'logs');
try {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
} catch (e) {
    // Fallback: if directory cannot be created, disable file transports below
}

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'blockchain-traceability' },
    transports: [
        // Console logging
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        
        // File logging - only if logs dir exists
        ...(fs.existsSync(logsDir) ? [
            new winston.transports.File({
                filename: path.join(logsDir, 'app.log'),
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: path.join(logsDir, 'error.log'),
                level: 'error',
                maxsize: 5242880,
                maxFiles: 5,
            }),
            new winston.transports.File({
                filename: path.join(logsDir, 'audit.log'),
                level: 'info',
                maxsize: 10485760,
                maxFiles: 10,
            })
        ] : [])
    ],
    
    // Handle uncaught exceptions
    exceptionHandlers: fs.existsSync(logsDir) ? [
        new winston.transports.File({ filename: path.join(logsDir, 'exceptions.log') })
    ] : [],
    
    // Handle unhandled promise rejections
    rejectionHandlers: fs.existsSync(logsDir) ? [
        new winston.transports.File({ filename: path.join(logsDir, 'rejections.log') })
    ] : []
});

// Blockchain-specific logging functions
const blockchainLogger = {
    productRegistered: (productId, farmerDetails, productDetails) => {
        logger.info('Product registered on blockchain', {
            event: 'PRODUCT_REGISTERED',
            productId,
            farmer: farmerDetails.name,
            location: farmerDetails.location,
            productType: productDetails.productType,
            batchSize: productDetails.batchSize,
            timestamp: new Date().toISOString()
        });
    },
    
    ownershipTransferred: (productId, fromRole, toRole, newOwner) => {
        logger.info('Product ownership transferred', {
            event: 'OWNERSHIP_TRANSFERRED',
            productId,
            fromRole,
            toRole,
            newOwner,
            timestamp: new Date().toISOString()
        });
    },
    
    productVerified: (productId, verifierInfo) => {
        logger.info('Product verified by consumer', {
            event: 'PRODUCT_VERIFIED',
            productId,
            verifierInfo,
            timestamp: new Date().toISOString()
        });
    },
    
    qrCodeGenerated: (productId, qrCodePath) => {
        logger.info('QR code generated', {
            event: 'QR_CODE_GENERATED',
            productId,
            qrCodePath,
            timestamp: new Date().toISOString()
        });
    },
    
    smsNotificationSent: (phoneNumber, productId, action, success) => {
        logger.info('SMS notification sent', {
            event: 'SMS_NOTIFICATION',
            phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*'), // Mask phone number
            productId,
            action,
            success,
            timestamp: new Date().toISOString()
        });
    }
};

// Security logging functions
const securityLogger = {
    authAttempt: (username, success, ip, userAgent) => {
        logger.info('Authentication attempt', {
            event: 'AUTH_ATTEMPT',
            username,
            success,
            ip,
            userAgent,
            timestamp: new Date().toISOString()
        });
    },
    
    unauthorizedAccess: (endpoint, ip, userAgent) => {
        logger.warn('Unauthorized access attempt', {
            event: 'UNAUTHORIZED_ACCESS',
            endpoint,
            ip,
            userAgent,
            timestamp: new Date().toISOString()
        });
    },
    
    rateLimitExceeded: (ip, endpoint) => {
        logger.warn('Rate limit exceeded', {
            event: 'RATE_LIMIT_EXCEEDED',
            ip,
            endpoint,
            timestamp: new Date().toISOString()
        });
    },
    
    suspiciousActivity: (description, details) => {
        logger.error('Suspicious activity detected', {
            event: 'SUSPICIOUS_ACTIVITY',
            description,
            details,
            timestamp: new Date().toISOString()
        });
    }
};

// Performance logging
const performanceLogger = {
    apiResponse: (method, endpoint, duration, statusCode) => {
        const level = statusCode >= 400 ? 'warn' : 'info';
        logger.log(level, 'API response', {
            event: 'API_RESPONSE',
            method,
            endpoint,
            duration: `${duration}ms`,
            statusCode,
            timestamp: new Date().toISOString()
        });
    },
    
    blockchainTransaction: (operation, duration, success) => {
        logger.info('Blockchain transaction', {
            event: 'BLOCKCHAIN_TRANSACTION',
            operation,
            duration: `${duration}ms`,
            success,
            timestamp: new Date().toISOString()
        });
    }
};

// System health logging
const systemLogger = {
    startup: (port, environment) => {
        logger.info('System startup', {
            event: 'SYSTEM_STARTUP',
            port,
            environment,
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        });
    },
    
    shutdown: (reason) => {
        logger.info('System shutdown', {
            event: 'SYSTEM_SHUTDOWN',
            reason,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    },
    
    healthCheck: (status, checks) => {
        logger.info('Health check', {
            event: 'HEALTH_CHECK',
            status,
            checks,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { logger, blockchainLogger, securityLogger, performanceLogger, systemLogger };
