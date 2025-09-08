# Project README

## Overview

This project is a Node.js backend providing QR code generation linked to product details pages, integrating with Hyperledger Fabric blockchain for product tracking and finalization.

***

## 1. Setup: Docker + WSL + VS Code Remote Explorer

### Prerequisites

- Windows 10/11 with **WSL 2** enabled.
- Docker Desktop configured to use WSL 2 backend.
- VS Code with **Remote - WSL** and **Remote - Containers** extensions.
- Node.js v16 LTS or newer installed inside WSL/Docker container.

### Instructions

- Open VS Code in WSL mode (`Remote-WSL: New Window`).
- Open your project folder inside this environment.
- (Optional) Use Docker container development via VS Code Remote Explorer.

***

## 2. Clone and prepare the project

```bash
git clone <repo-url>
cd <project-folder>
npm install
```

- Installs all dependencies.
- Use `npm install --force` only if absolutely necessary.

***

## 3. Environment Configuration

Create `.env` in the root with variables:

```env
PORT=3000
CONNECTION_PROFILE=path/to/connection-profile.json
WALLET_PATH=path/to/wallet
CLIENT_IDENTITY=yourIdentity
CHANNEL_NAME=yourchannel
CHAINCODE_NAME=yourchaincode
QR_JWT_PRIVKEY="your RSA private key PEM string"
QR_JWT_PUBKEY="your RSA public key PEM string"
```

Adjust values accordingly.

***

## 4. Running the server

```bash
npm start
```

You will see:

```
API server listening on port 3000
```

***

## 5. Testing and Usage

- Visit `http://localhost:3000/` for the QR code generation page.
- Click **Generate QR Code** to get the QR image.
- Scan QR with your phone; it opens the configured product details link.
- Visit `http://localhost:3000/api/product-details.html` to view dummy product info.

***

## 6. Accessing from mobile on same network

- Find your PC's local IP (e.g., `192.168.1.100`).
- Replace `localhost` in URLs with your IP so phone can access server.
- Ensure firewall allows port 3000 inbound.
- Connect phone and PC to same Wi-Fi.

***

## 7. Notes & Common Issues

### npm dependency errors

- Early errors with `ETARGET` and package versions (`@hyperledger/fabric-gateway`) were due to unpublished or unavailable versions on public npm.
- Resolution: Use stable `fabric-network@2.2.20`.
- Avoid `npm audit fix --force` as it can downgrade packages causing breaking changes.
- Use `npm cache clean --force` cautiously to fix corrupt caches.

### Syntax errors in `qr.js`

- Regex for stripping base64 prefix needed correction:  
  Incorrect: `^data:image\\/png;base64,`  
  Correct: `^data:image\/png;base64,`

### Server & Networking Tips

- “Cannot GET /” occurs if no root route is defined.
- Add root route serving friendly HTML to avoid this.
- Localhost URLs are not accessible from phone directly.
- Always replace `localhost` with PC's LAN IP for mobile testing.
- Consider tools like `ngrok` for public tunnels.

### Debugging

- Use `curl` commands to verify API response headers and content.
- Run server continuously in one terminal and use another to call APIs.
- Check firewall and Docker port mappings carefully.

***

## Useful commands

| Task                    | Command                          |
|-------------------------|---------------------------------|
| Install dependencies    | `npm install`                   |
| Clear npm cache         | `npm cache clean --force`       |
| Start server            | `npm start`                    |
| Test QR code generation | `curl http://localhost:3000/api/qr/test-product` |
| Save QR code to file    | `curl http://localhost:3000/api/qr/save/test-product` |

***

## References & Links

- [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/)
- [VS Code Remote - WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/wsl/)
- [QR Code Node.js Library](https://github.com/soldair/node-qrcode)

***

## Next Steps

- Integrate frontend UI with backend APIs.
- Replace dummy URLs with real app URLs.
- Add blockchain transaction interactions.
- Implement authentication and secure token workflows.

***

