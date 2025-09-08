import express from 'express';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Endpoint to generate QR code linking to a dummy product details page
router.get('/qr/test-product', async (req, res) => {
  try {
    const productDetailsUrl = 'https://example.com/product-details.html';
    const qrDataUrl = await QRCode.toDataURL(productDetailsUrl);

    const img = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    });
    res.end(img);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Route to view QR code inline in a simple HTML page
router.get('/qr/view/test-product', (req, res) => {
  res.send(`
    <html><body>
      <h1>QR Code for Test Product</h1>
      <img src="/api/qr/test-product" alt="Test Product QR Code" />
    </body></html>
  `);
});

// Route to save QR code PNG locally in qrcodes folder
router.get('/qr/save/test-product', async (req, res) => {
  try {
    const productDetailsUrl = 'https://example.com/product-details.html';
    const qrDataUrl = await QRCode.toDataURL(productDetailsUrl);

    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');

    const dir = path.join(process.cwd(), 'qrcodes');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, 'test-product.png');
    fs.writeFileSync(filePath, base64Data, 'base64');

    res.json({ message: 'QR code saved', path: filePath });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Dummy product details page for testing
router.get('/product-details.html', (req, res) => {
  const dummyHtml = `
    <html>
      <head><title>Product Details</title></head>
      <body>
        <h1>Product: TEST-PRODUCT-001</h1>
        <p>Status: ACTIVE</p>
        <p>Last Updated: 2025-09-08T14:30:00Z</p>
        <h2>Tracking History:</h2>
        <ul>
          <li>Created at Factory: 2025-06-01</li>
          <li>Shipped to Distributor: 2025-07-15</li>
          <li>Received by Retailer: 2025-08-10</li>
          <li>Scanned by Consumer: 2025-09-08</li>
        </ul>
      </body>
    </html>
  `;
  res.send(dummyHtml);
});

export default router;
