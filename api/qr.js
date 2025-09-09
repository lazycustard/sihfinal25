const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate QR code for a specific product
router.post('/qr/generate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const baseUrl = req.protocol + '://' + req.get('host');
    const productVerificationUrl = `${baseUrl}/verify/${productId}`;
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(productVerificationUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const img = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
      'Content-Disposition': `attachment; filename="product-${productId}-qr.png"`
    });
    res.end(img);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save QR code to file system
router.post('/qr/save/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const baseUrl = req.protocol + '://' + req.get('host');
    const productVerificationUrl = `${baseUrl}/verify/${productId}`;
    
    const qrDataUrl = await QRCode.toDataURL(productVerificationUrl, {
      width: 300,
      margin: 2
    });

    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    
    const dir = path.join(process.cwd(), 'qrcodes');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${productId}.png`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, base64Data, 'base64');

    res.json({ 
      success: true,
      message: 'QR code saved successfully',
      fileName,
      path: filePath,
      verificationUrl: productVerificationUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get QR code as base64 data URL
router.get('/qr/data/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const baseUrl = req.protocol + '://' + req.get('host');
    const productVerificationUrl = `${baseUrl}/verify/${productId}`;
    
    const qrDataUrl = await QRCode.toDataURL(productVerificationUrl, {
      width: 300,
      margin: 2
    });

    res.json({
      success: true,
      productId,
      qrCode: qrDataUrl,
      verificationUrl: productVerificationUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate batch QR codes for multiple products
router.post('/qr/batch', async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs array is required' });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const results = [];

    for (const productId of productIds) {
      const productVerificationUrl = `${baseUrl}/verify/${productId}`;
      const qrDataUrl = await QRCode.toDataURL(productVerificationUrl, {
        width: 300,
        margin: 2
      });

      results.push({
        productId,
        qrCode: qrDataUrl,
        verificationUrl: productVerificationUrl
      });
    }

    res.json({
      success: true,
      count: results.length,
      qrCodes: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View QR code in HTML page
router.get('/qr/view/:productId', (req, res) => {
  const { productId } = req.params;
  const baseUrl = req.protocol + '://' + req.get('host');
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Code - Product ${productId}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .qr-container {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                margin: 20px 0;
            }
            .product-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .download-btn {
                background: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin: 10px;
            }
            .download-btn:hover {
                background: #0056b3;
            }
        </style>
    </head>
    <body>
        <h1>Product QR Code</h1>
        <div class="product-info">
            <h2>Product ID: ${productId}</h2>
            <p>Scan this QR code to verify product authenticity and view traceability information</p>
        </div>
        
        <div class="qr-container">
            <img id="qrImage" alt="QR Code for Product ${productId}" style="max-width: 300px;" />
        </div>
        
        <a href="${baseUrl}/api/qr/generate/${productId}" class="download-btn" download="product-${productId}-qr.png">
            Download QR Code
        </a>
        
        <a href="${baseUrl}/verify/${productId}" class="download-btn">
            View Product Details
        </a>

        <script>
            // Load QR code
            fetch('${baseUrl}/api/qr/data/${productId}')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('qrImage').src = data.qrCode;
                    }
                })
                .catch(error => console.error('Error loading QR code:', error));
        </script>
    </body>
    </html>
  `);
});

module.exports = router;
