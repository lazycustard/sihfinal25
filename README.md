.
# 🌱 FarmTrace - Blockchain Product Traceability System

A comprehensive blockchain-based product traceability system for agricultural supply chains, ensuring transparency from farm to consumer.

## ✨ Features

### 🌾 **Farmer Dashboard**
- Register new products with detailed information
- Generate QR codes for product tracking
- Track product batches and earnings
- Manage farm inventory and certifications

### 🚚 **Distributor/Retailer Management**
- Receive products from farmers
- Transfer ownership in the supply chain
- Update product locations and handling info
- Manage distribution network

### 👥 **Consumer Experience**
- Scan QR codes to verify product authenticity
- View complete product journey from farm to table
- Check freshness scores and certifications
- Access farmer information and contact details

### ⚙️ **Admin Panel**
- System overview and analytics dashboard
- User management and role assignment
- System configuration and monitoring
- Performance metrics and reporting

## 🚀 Quick Start

### **Option 1: Docker (Recommended)**

```bash
# Clone the repository
git clone <repository-url>
cd sih25

# Run with Docker
.\start.bat  # Windows
# OR
docker compose up --build  # Linux/Mac

# Access the application
# Open browser to http://localhost:3000
```

### **Option 2: Manual Setup**

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Build frontend
npm run build:frontend

# Start the server
npm start
```

## 🔑 Demo Credentials

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| **Admin** | admin | admin123 | System administration |
| **Farmer** | farmer1 | demo123 | Product registration |
| **Distributor** | distributor1 | demo123 | Supply chain management |
| **Retailer** | retailer1 | demo123 | Retail operations |
| **Consumer** | consumer1 | demo123 | Product verification |

## 🏗️ Technology Stack

### **Frontend**
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Vite** for build tooling

### **Backend**
- **Node.js** with Express.js
- **JWT** authentication
- **Bcrypt** password hashing
- **Winston** logging
- **CORS** and security headers

### **Blockchain Integration**
- **Mock Blockchain Service** (development)
- **Product Registration** and tracking
- **Ownership Transfer** management
- **Transaction History** recording
- **Chain Finalization** on consumer scan

### **Deployment**
- **Docker** containerization
- **Docker Compose** orchestration
- **Health checks** and monitoring
- **Environment configuration**

## 📡 API Endpoints

### **Authentication**
```
POST /api/auth/login          - User login
POST /api/auth/register       - User registration
GET  /api/auth/profile        - Get user profile
GET  /api/auth/demo-credentials - Demo credentials
```

### **Product Management**
```
POST /api/products/register   - Register new product
POST /api/products/:id/transfer - Transfer ownership
GET  /api/products/:id/history - Get product history
GET  /api/products            - Get all products
POST /api/products/:id/complete - Complete product journey
POST /api/products/:id/finalize - Finalize blockchain
```

### **QR Code Management**
```
GET  /api/qr/data/:id         - Generate QR code data
POST /api/qr/save/:id         - Save QR code image
GET  /api/qr-verify/:id       - Verify product (public)
```

### **System**
```
GET  /api/status              - System status
GET  /api/analytics/dashboard - Analytics data
GET  /health                  - Health check
```

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  Pages: Farmer, Consumer, Admin, Distributor, Retailer     │
│  Components: QRScanner, RoleCard, Layout                   │
│  Services: API integration, Authentication                 │
│  Contexts: AuthContext for state management                │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)             │
├─────────────────────────────────────────────────────────────┤
│  API Routes: Authentication, Products, QR, Analytics       │
│  Services: Blockchain, Encryption, SMS, External APIs      │
│  Middleware: Auth, Security, CORS, Validation              │
│  Utils: Logging, Encryption, Error handling                │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                Blockchain Service (Mock)                    │
├─────────────────────────────────────────────────────────────┤
│  Product Registration & Tracking                           │
│  Ownership Transfer Management                              │
│  Transaction History Recording                              │
│  Chain Finalization on Consumer Scan                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Security Features

- **JWT-based Authentication** with role-based access control
- **Data Encryption** for sensitive information
- **Security Headers** (CORS, XSS protection, etc.)
- **Input Validation** and sanitization
- **Password Hashing** with bcrypt
- **Rate Limiting** and request validation

## 🚀 Deployment

### **Production with Docker**

```bash
# Build production image
docker build -t farmtrace:latest .

# Run with environment variables
docker run -d \
  --name farmtrace \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-production-secret \
  -e ENCRYPTION_KEY=your-32-char-key \
  farmtrace:latest
```

### **Production with Docker Compose**

```bash
# Copy environment file
cp env.example .env

# Edit environment variables
# Then run:
docker compose -f docker-compose.prod.yml up -d
```

### **Environment Variables**

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key
```

## 📊 Monitoring & Health Checks

- **Health Check**: `GET /health`
- **System Status**: `GET /api/status`
- **Application Logs**: Winston logging system
- **Performance Metrics**: Built-in monitoring
- **Docker Health Checks**: Automatic container monitoring

## 🧪 Testing the System

1. **Start the application** using `.\start.bat` or Docker
2. **Open browser** to `http://localhost:3000`
3. **Login as farmer1/demo123** to register products
4. **Login as distributor1/demo123** to transfer ownership
5. **Login as consumer1/demo123** to verify products
6. **Use QR codes** to trace product journey

## 📁 Project Structure

```
sih25/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   ├── package.json
│   └── vite.config.ts
├── api/                     # Backend API
│   ├── auth.js             # Authentication routes
│   ├── blockchain.js       # Blockchain service
│   ├── qr.js              # QR code management
│   └── index.js           # Main server file
├── config/                 # Configuration files
├── utils/                  # Utility functions
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Docker build file
├── start.bat             # Windows startup script
└── DEPLOYMENT.md         # Deployment guide
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check `DEPLOYMENT.md` for detailed setup
- **Issues**: Open an issue on GitHub
- **Demo**: Use the provided demo credentials to test all features

## 🎯 Roadmap

- [ ] Real blockchain integration (Hyperledger Fabric)
- [ ] Database persistence (PostgreSQL)
- [ ] Mobile app (React Native)
- [ ] IoT sensor integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] SMS/Email notifications
- [ ] API rate limiting
- [ ] Caching layer (Redis)

---

**Built with ❤️ for Smart India Hackathon 2025**