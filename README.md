# 🌱 FarmTrace - Blockchain Product Traceability System

Complete blockchain-based product traceability system with React frontend and Node.js backend.

## 🚀 **QUICK START - 3 STEPS**

### **Step 1: Install Requirements**
Choose ONE option:
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/) (Recommended)
- **Node.js**: [Download here](https://nodejs.org/) (LTS version)

### **Step 2: Run the System**
**Windows**: Double-click `start.bat`
**Any OS**: Run `docker compose up --build`

### **Step 3: Access & Test**
- **Open**: http://localhost:3000
- **Login**: farmer1 / demo123
- **Create**: Product → Generate QR
- **Verify**: Login as consumer1/demo123 → Trace product

## 🔑 **Demo Credentials**
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Farmer | farmer1 | demo123 |
| Distributor | distributor1 | demo123 |
| Retailer | retailer1 | demo123 |
| Consumer | consumer1 | demo123 |

## 🛠️ **Technology Stack**
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT Authentication
- **Blockchain**: Mock Hyperledger Fabric integration
- **QR Codes**: Generation, saving, and verification
- **Containerization**: Docker & Docker Compose

## 🎯 **Complete Workflow**
1. **Farmer**: Register → Create Product → Generate QR Code
2. **Distributor**: Transfer ownership → Update location
3. **Retailer**: Receive product → Update inventory
4. **Consumer**: Scan QR → View complete journey

## 🆘 **Troubleshooting**
- **Port 3000 in use**: Run `npx kill-port 3000`
- **Docker issues**: Run `docker system prune -a`
- **Node.js not found**: Install from nodejs.org and restart computer

---
**🎉 Ready to run on any laptop!**
