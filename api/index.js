import express from 'express';
import qrRouter from './qr.js';

const app = express();

app.use(express.json());
app.use('/api', qrRouter);

// Root page with button and QR display
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><title>QR Code Generator</title></head>
    <body>
      <h1>QR Code Generator</h1>
      <button id="generateBtn">Generate QR Code</button>
      <div>
        <img id="qrImage" style="margin-top: 20px; max-width: 300px;" />
      </div>

      <script>
        document.getElementById('generateBtn').addEventListener('click', async () => {
          const imgEl = document.getElementById('qrImage');
          try {
            const response = await fetch('/api/qr/test-product');
            if (!response.ok) {
              alert('Failed to generate QR code');
              return;
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            imgEl.src = url;
          } catch (err) {
            alert('Error: ' + err.message);
          }
        });
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
