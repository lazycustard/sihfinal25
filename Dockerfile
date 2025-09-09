# Dockerfile for Blockchain Traceability System
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better cache
COPY package*.json ./

# Install dependencies (include dev for build)
RUN npm install

# Copy application code
COPY . .

# Create qrcodes directory
RUN mkdir -p qrcodes

# Build frontend from Vite project (frontend/) and publish to public
WORKDIR /app/frontend
RUN npm install
RUN npm run build
WORKDIR /app
RUN rm -rf ./public && mkdir -p ./public
RUN if [ -d "./dist" ]; then cp -r ./dist/* ./public/ && rm -rf ./dist; fi

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]
