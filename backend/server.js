const express = require('express');
const path = require('path');
const app = express();

// Redirect /verify/:productId to /trace/:productId
app.get('/verify/:productId', (req, res) => {
  res.redirect(`/trace/${req.params.productId}`);
});

// Serve trace page
app.get('/trace/:productId', (req, res) => {
  // If SPA, serve index.html for React Router
  serveSpaIndex(res);
});

// SPA fallback routing
function serveSpaIndex(res) {
  const locations = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'dist', 'index.html'),
    path.join(__dirname, 'frontend', 'dist', 'index.html'),
  ];
  for (const loc of locations) {
    if (require('fs').existsSync(loc)) {
      return res.sendFile(loc);
    }
  }
  res.status(404).send('index.html not found');
}

// Fallback for all other SPA routes
app.get('*', (req, res) => {
  serveSpaIndex(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));