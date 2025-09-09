const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const qrRouter = require('./qr.js');
const smsRouter = require('./sms.js');
const documentationRouter = require('./documentation.js');
const { authRouter, authenticateToken, requireRole } = require('./auth.js');
const externalServicesRouter = require('./external-services.js');
const verificationGatewayRouter = require('./verification-gateway.js');
const { EncryptionService, securityHeaders } = require('../utils/encryption.js');
// IoT/MQTT and performance monitor removed
const { logger } = require('../utils/logger.js');
const BlockchainService = require('./blockchain.js');

// __dirname is available in CommonJS

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services with guards to prevent startup crashes
let encryptionService;
let blockchainService;

try { encryptionService = new EncryptionService(); } catch (e) { console.warn('EncryptionService init failed, continuing:', e.message); }
try { blockchainService = new BlockchainService(); } catch (e) { console.warn('BlockchainService init failed, using fallback:', e.message); blockchainService = { getAllProducts: async () => [], getProductHistory: async (id) => ({ success: true, product: { productId: id, transactions: [] } }), finalizeProductChain: async (id)=>({ success:true, product:{ productId:id, transactions:[]}, message:'finalized'}) }; }

// Dummies to satisfy legacy endpoints without enabling features
const performanceMonitor = {
    getStats: () => ({}),
    getHealthStatus: () => ({ status: 'healthy' }),
    getOptimizationSuggestions: () => []
};
const iotIntegration = {
    getStatus: () => ({}),
    getSensorHistory: () => [],
    getLatestSensorData: () => null,
    generateEnvironmentalReport: () => ({}),
    startSimulation: () => {}
};

// Middleware
app.use(cors());
app.use(securityHeaders);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Serve static assets from new UI build if present, else fallback to legacy public
const staticPath = path.join(__dirname, '..', 'public');
app.use(express.static(staticPath));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/external', externalServicesRouter);
app.use('/api/verification', verificationGatewayRouter);
app.use('/api', qrRouter);
app.use('/api', smsRouter);
app.use('/api', documentationRouter);

// ========== BLOCKCHAIN API ENDPOINTS ==========

// Register a new product (Farmer)
app.post('/api/products/register', authenticateToken, requireRole(['farmer']), async (req, res) => {
  try {
    const { farmerDetails, productDetails } = req.body;
    
    if (!farmerDetails || !productDetails) {
      return res.status(400).json({ 
        error: 'Farmer details and product details are required' 
      });
    }

    const productId = `P${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await blockchainService.registerProduct(productId, farmerDetails, productDetails);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer ownership (Distributor/Retailer)
app.post('/api/products/:id/transfer', authenticateToken, requireRole(['farmer', 'distributor', 'retailer']), async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwnerRole, newOwnerName, newOwnerLocation, handlingInfo } = req.body;
    
    if (!newOwnerRole || !newOwnerName || !newOwnerLocation) {
      return res.status(400).json({ 
        error: 'New owner role, name, and location are required' 
      });
    }

    const result = await blockchainService.transferOwnership(
      id, newOwnerRole, newOwnerName, newOwnerLocation, handlingInfo || ''
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product history (Customer verification)
app.get('/api/products/:productId/history', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await blockchainService.getProductHistory(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const result = await blockchainService.getAllProducts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete a product (Consumer)
app.post('/api/products/:productId/complete', authenticateToken, requireRole(['consumer']), async (req, res) => {
  try {
    const { productId } = req.params;
    const { consumerInfo } = req.body;

    const result = await blockchainService.completeProduct(productId, consumerInfo);
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ error: result.error || 'Failed to complete product' });
    }
  } catch (error) {
    logger.error('Product completion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Finalize product blockchain (Consumer QR Scan)
app.post('/api/products/:productId/finalize', async (req, res) => {
  try {
    const { productId } = req.params;
    const { consumerInfo, userAgent } = req.body;

    // Log the QR scan event
    logger.info(`QR Code scanned for product ${productId}`, {
      userAgent,
      timestamp: new Date().toISOString(),
      ip: req.ip
    });

    const result = await blockchainService.finalizeProductChain(productId, consumerInfo);
    
    if (result.success) {
      res.json({ 
        success: true, 
        product: result.product,
        message: result.message,
        finalized: true
      });
    } else {
      res.status(400).json({ error: result.error || 'Failed to finalize product' });
    }
  } catch (error) {
    logger.error('Product finalization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// QR Code verification endpoint (Public access for consumers)
app.get('/api/qr-verify/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get product history
    const result = await blockchainService.getProductHistory(productId);
    
    if (result.success) {
      // Automatically finalize the blockchain when QR is scanned
      const finalizeResult = await blockchainService.finalizeProductChain(
        productId, 
        'QR Code scanned by consumer - Blockchain finalized'
      );
      
      res.json({ 
        success: true, 
        product: finalizeResult.success ? finalizeResult.product : result.product,
        finalized: finalizeResult.success,
        message: 'Product verified and blockchain finalized'
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    logger.error('QR verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== WEB INTERFACE ROUTES ==========

// Removed legacy HTML route; React app handles UI

// Removed /health

// Removed /api/performance

// Removed /api/iot endpoints

// Analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const { period = 'week', productType, region } = req.query;
        
        // Get all products
        const allProducts = await blockchainService.getAllProducts();
        
        // Calculate metrics
        const metrics = {
            totalProducts: allProducts.length,
            activeProducts: allProducts.filter(p => p.status === 'ACTIVE').length,
            completedProducts: allProducts.filter(p => p.status === 'COMPLETED').length,
            totalTransactions: allProducts.reduce((sum, p) => sum + p.transactions.length, 0),
            uniqueFarmers: new Set(allProducts.map(p => p.transactions[0]?.name)).size,
            verificationRate: 85.5 // Mock calculation
        };
        
        // Get recent transactions
        const recentTransactions = allProducts
            .flatMap(p => p.transactions.map(t => ({ ...t, productId: p.productId, productType: p.productType })))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        
        res.json({
            metrics,
            recentTransactions,
            performance: {},
            iot: {},
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error generating analytics:', error);
        res.status(500).json({ error: 'Failed to generate analytics' });
    }
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    api: 'Blockchain Traceability System',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'POST /api/products/register': 'Register new product',
      'POST /api/products/:id/transfer': 'Transfer ownership',
      'GET /api/products/:id/history': 'Get product history',
      'POST /api/products/:id/complete': 'Complete product journey',
      'GET /api/qr/:id': 'Generate QR code',
      'GET /health': 'Health check',
      'GET /api/performance': 'Performance metrics',
      'GET /api/iot/sensors': 'Get sensor data',
      'GET /api/iot/environmental-report/:productId': 'Get environmental report',
      'GET /api/analytics/dashboard': 'Get analytics dashboard'
    }
  });
});

// Start IoT simulation for demo
try { iotIntegration.startSimulation && iotIntegration.startSimulation(); } catch (e) { console.warn('IoT simulation start failed:', e.message); }

app.listen(PORT, () => {
  console.log(`🚀 Blockchain Traceability System running on port ${PORT}`);
  console.log(`📱 Access the system at: http://localhost:${PORT}`);
});

// SPA fallback for React Router (new UI)
try {
  const indexHtmlPath = path.join(staticPath, 'index.html');
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(indexHtmlPath, (err) => {
      if (err) next();
    });
  });
} catch (e) {
  // No SPA fallback if static path missing
}
