# FarmTrace - Blockchain Product Traceability System

## 🚀 Deployment Guide

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sih25
   ```

2. **Run with Docker (Recommended)**
   ```bash
   # Windows
   .\start.bat
   
   # Linux/Mac
   docker compose up --build
   ```

3. **Access the application**
   - Open browser to `http://localhost:3000`
   - Use demo credentials to test the system

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Farmer | farmer1 | demo123 |
| Distributor | distributor1 | demo123 |
| Retailer | retailer1 | demo123 |
| Consumer | consumer1 | demo123 |

### Manual Setup (Development)

1. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Build frontend**
   ```bash
   npm run build:frontend
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Environment Configuration

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Key environment variables:
- `NODE_ENV`: development/production
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: JWT signing secret
- `ENCRYPTION_KEY`: Data encryption key

### Production Deployment

#### Using Docker

1. **Build production image**
   ```bash
   docker build -t farmtrace:latest .
   ```

2. **Run with environment variables**
   ```bash
   docker run -d \
     --name farmtrace \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e JWT_SECRET=your-production-secret \
     -e ENCRYPTION_KEY=your-32-char-key \
     farmtrace:latest
   ```

#### Using Docker Compose

1. **Create production compose file**
   ```yaml
   version: '3.8'
   services:
     app:
       image: farmtrace:latest
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - JWT_SECRET=your-production-secret
         - ENCRYPTION_KEY=your-32-char-key
       volumes:
         - ./qrcodes:/app/qrcodes
       restart: unless-stopped
   ```

2. **Deploy**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Features

#### 🌾 Farmer Dashboard
- Register new products
- Generate QR codes
- Track product batches
- View earnings and statistics

#### 🚚 Distributor/Retailer
- Receive products from farmers
- Transfer ownership
- Update product locations
- Manage inventory

#### 👥 Consumer
- Scan QR codes to verify products
- View complete product journey
- Check authenticity and freshness
- Access farmer information

#### ⚙️ Admin Panel
- System overview and analytics
- User management
- System configuration
- Performance monitoring

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/demo-credentials` - Get demo credentials

#### Product Management
- `POST /api/products/register` - Register new product
- `POST /api/products/:id/transfer` - Transfer ownership
- `GET /api/products/:id/history` - Get product history
- `GET /api/products` - Get all products
- `POST /api/products/:id/complete` - Complete product journey
- `POST /api/products/:id/finalize` - Finalize blockchain

#### QR Code Management
- `GET /api/qr/data/:id` - Generate QR code data
- `POST /api/qr/save/:id` - Save QR code image
- `GET /api/qr-verify/:id` - Verify product (public)

#### Analytics
- `GET /api/analytics/dashboard` - Get analytics data
- `GET /api/status` - System status

### Architecture

```
Frontend (React + TypeScript)
├── Pages (Farmer, Consumer, Admin, etc.)
├── Components (QRScanner, RoleCard, etc.)
├── Services (API integration)
└── Contexts (Authentication)

Backend (Node.js + Express)
├── API Routes (Authentication, Products, QR)
├── Services (Blockchain, Encryption, SMS)
├── Middleware (Auth, Security)
└── Utils (Logging, Encryption)

Blockchain Service
├── Product Registration
├── Ownership Transfer
├── Transaction History
└── Chain Finalization
```

### Security Features

- JWT-based authentication
- Role-based access control
- Data encryption
- Security headers
- Input validation
- CORS protection

### Monitoring

- Health check endpoint: `/health`
- System status: `/api/status`
- Application logs via Winston
- Performance metrics

### Troubleshooting

#### Common Issues

1. **Docker build fails**
   - Check Docker is running
   - Ensure sufficient disk space
   - Try `docker system prune` to clean up

2. **Frontend not loading**
   - Check if frontend build completed successfully
   - Verify static files are served correctly
   - Check browser console for errors

3. **API errors**
   - Check server logs
   - Verify environment variables
   - Ensure all dependencies are installed

4. **QR codes not generating**
   - Check qrcodes directory permissions
   - Verify QR generation service is working
   - Check file system space

#### Logs

```bash
# View Docker logs
docker logs farmtrace

# View real-time logs
docker logs -f farmtrace

# View specific service logs
docker compose logs app
```

### Support

For issues and questions:
1. Check this documentation
2. Review application logs
3. Test with demo credentials
4. Verify system requirements

### License

MIT License - See LICENSE file for details.
