import jwt from 'jsonwebtoken';

const privateKey = process.env.QR_JWT_PRIVKEY; // RSA private key PEM string
const token = jwt.sign(
  {
    assetId: 'BATCH-0001',
    nonce: 'random123',
    purpose: 'finalize',
    aud: 'consumers',
    iss: 'your-domain'
  },
  privateKey,
  {
    algorithm: 'RS256',
    expiresIn: '5m'
  }
);

const deepLink = `https://app.your-domain.example/p/asset/BATCH-0001?token=${encodeURIComponent(token)}&return_to=/p/asset/BATCH-0001`;
console.log(deepLink);
