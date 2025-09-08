Here is a complete README file that guides through the entire procedure—from setting up Docker with WSL in VS Code Remote Explorer, configuring the project, running the Node.js/npm server, and accessing the website locally step-by-step:

***

# Project README

## Overview

This project provides a Node.js backend server that generates QR codes linked to product details pages, with blockchain-backed product tracking using Hyperledger Fabric. This README explains:

1. How to set up Docker on Windows using WSL with VS Code Remote Explorer.
2. How to clone and configure the project.
3. How to run the Node.js server locally (inside Docker or local environment).
4. How to access the website and scan QR codes for product info.

***

## 1. Setup: Docker + WSL + VS Code Remote Explorer

### Prerequisites

- Windows 10/11 with **WSL 2** installed and enabled.
- Docker Desktop installed and configured to use WSL 2 backend.
- VS Code installed with **Remote - WSL** and **Remote - Containers** extensions.
- Node.js (v16 LTS or newer) installed either in Docker container or WSL environment.

### Steps

1. Open VS Code.
2. Press `Ctrl+Shift+P`, run **Remote-WSL: New Window**, which opens a new VS Code window inside your WSL distro.
3. Open your project folder inside WSL.
4. (Optional) To use Docker containerized development, open the **Remote Explorer** tab in VS Code, choose **Containers**, and connect to a running container or create one from your Dockerfile.

***

## 2. Clone and prepare the project

1. Clone the repo or copy project files into your WSL environment.

   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. Install Node.js dependencies

   ```bash
   npm install
   ```

3. (Optional) If you want to run your server inside Docker, build and run the Docker container:

   ```bash
   docker build -t your-project-image .
   docker run -p 3000:3000 -v $(pwd):/app your-project-image
   ```

***

## 3. Configure environment variables

Create a `.env` file in your project root (or set OS environment variables) containing:

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

Adjust paths and values accordingly for your Fabric network setup and JWT keys.

***

## 4. Run the Node.js server

Start the server locally (or inside container):

```bash
npm start
```

You will see:

```
API server listening on port 3000
```

***

## 5. Access the website and test QR codes

- Open browser at:

  ```
  http://localhost:3000/
  ```

- Click **Generate QR Code** button 
- QR code image appears; scan it with your phone.

- Scanning the QR code opens the hardcoded product details page or your configured URL.

- To test product details page directly:

  ```
  http://localhost:3000/api/product-details.html
  ```

***

## 6. Scan QR codes on your mobile device in the same network

- Replace `localhost` with your PC’s IP address in all URLs if scanning from phone:

  ```
  http://<your-pc-ip>:3000/
  ```

- Ensure your PC firewall allows incoming connections on port 3000.

- Connect your phone to the same Wi-Fi network.

***

## 7. Extending the project

- Replace hardcoded URLs with your real frontend URLs.
- Integrate blockchain queries and finalize transactions with Fabric SDK.
- Add user login flows and JWT verification.
- Build frontend to show live product history and scan events.
- Secure all endpoints and JWT keys.

***

## Troubleshooting

- Server not reachable? Check Docker port binding or firewall.
- NPM install errors? Clear cache and verify Node.js version.
- QR code not scannable? Try generating and saving PNG files locally.

***

## Useful commands

| Task                       | Command                                    |
|----------------------------|--------------------------------------------|
| Install dependencies        | `npm install`                              |
| Start server               | `npm start`                                |
| Restart Docker container    | `docker restart <container_name>`         |
| Build Docker image          | `docker build -t your-image .`             |
| Download QR code image      | `curl http://localhost:3000/api/qr/save/test-product` |

***

## References & Links

- [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/)
- [VS Code Remote - WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/wsl/)
- [QR Code Library (qrcode)](https://github.com/soldair/node-qrcode)

***

Feel free to reach out if you want specific guidance on any step or feature!
