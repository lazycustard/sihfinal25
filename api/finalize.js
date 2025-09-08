import express from 'express';
import jwt from 'jsonwebtoken';
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';

const router = express.Router();
const JWT_PUBLIC_KEY = process.env.QR_JWT_PUBKEY;

async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(process.env.CONNECTION_PROFILE, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(process.env.WALLET_PATH);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: process.env.CLIENT_IDENTITY,
    discovery: { enabled: true, asLocalhost: false }
  });
  const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
  return { contract: network.getContract(process.env.CHAINCODE_NAME), gateway, network };
}

router.post('/finalize', async (req, res) => {
  try {
    const { token, assetId, receiptHash } = req.body;
    const payload = jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    if (payload.assetId !== assetId) return res.status(400).json({ error: 'asset mismatch' });

    const { contract, gateway, network } = await getContract();

    // Optional event listener
    const listener = async (event) => {
      if (event.eventName === 'AssetFinalized') {
        const data = JSON.parse(event.payload.toString());
        if (data.assetId === assetId) {
          // notify clients via websockets / SSE here if you want
        }
      }
    };
    await network.addBlockListener(listener, { type: 'full' });

    const tx = contract.createTransaction('FinalizeAsset');
    const result = await tx.submit(assetId, receiptHash);
    await gateway.disconnect();

    res.json({ ok: true, txId: tx.getTransactionId(), result: result.toString() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
