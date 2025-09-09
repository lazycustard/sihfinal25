// Mock blockchain service for development (CommonJS)
const path = require('path');
const fs = require('fs');

class BlockchainService {
    constructor() {
        // Mock service - no blockchain connection needed
        console.log('🔧 Using mock blockchain service for development');
    }

    async registerProduct(productId, farmerDetails, productDetails) {
        return this.mockRegisterProduct(productId, farmerDetails, productDetails);
    }

    async transferOwnership(productId, newOwnerRole, newOwnerName, newOwnerLocation, handlingInfo) {
        // Check if product is finalized
        const productHistory = await this.getProductHistory(productId);
        if (productHistory.success && productHistory.product.finalized) {
            return { 
                success: false, 
                error: 'Cannot transfer ownership - Product blockchain has been finalized by consumer scan' 
            };
        }
        
        console.log(`Mock: Ownership transferred for ${productId} to ${newOwnerName}`);
        return { success: true, productId, message: 'Ownership transferred successfully' };
    }

    async getProductHistory(productId) {
        return this.mockGetProductHistory(productId);
    }

    async getAllProducts() {
        console.log('Mock: Getting all products');
        // Return array for compatibility with callers that expect array
        return [];
    }

    async completeProduct(productId, consumerInfo) {
        return this.mockCompleteProduct(productId, consumerInfo);
    }

    async finalizeProductChain(productId, consumerInfo) {
        return this.mockFinalizeProductChain(productId, consumerInfo);
    }

    // Mock implementation for development when blockchain is not available
    async mockRegisterProduct(productId, farmerDetails, productDetails) {
        const mockProduct = {
            productId,
            productType: productDetails.productType,
            batchSize: productDetails.batchSize,
            harvestDate: productDetails.harvestDate,
            status: 'ACTIVE',
            transactions: [{
                role: 'Farmer',
                name: farmerDetails.name,
                location: farmerDetails.location,
                timestamp: new Date().toISOString(),
                handlingInfo: `Product registered - ${productDetails.productType}`,
                transactionId: `TXN-${Date.now()}`
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Mock: Product registered', mockProduct);
        return { success: true, productId, message: 'Product registered successfully (mock)' };
    }

    async mockGetProductHistory(productId) {
        const mockProduct = {
            productId,
            productType: 'Mango',
            batchSize: '100 kg',
            harvestDate: '2025-09-01',
            status: 'ACTIVE',
            transactions: [
                {
                    role: 'Farmer',
                    name: 'Ravi Kumar',
                    location: 'Nashik, MH',
                    timestamp: '2025-09-08T10:00:00Z',
                    handlingInfo: 'Product registered - Mango',
                    transactionId: 'TXN-1725782400000'
                },
                {
                    role: 'Distributor',
                    name: 'Agro Supply Pvt Ltd',
                    location: 'Mumbai, MH',
                    timestamp: '2025-09-10T15:30:00Z',
                    handlingInfo: 'Received from farmer, stored in cold storage',
                    transactionId: 'TXN-1725982200000'
                }
            ],
            createdAt: '2025-09-08T10:00:00Z',
            updatedAt: '2025-09-10T15:30:00Z'
        };

        return { success: true, product: mockProduct };
    }

    async mockCompleteProduct(productId, consumerInfo) {
        const mockProduct = {
            productId,
            productType: 'Mango',
            batchSize: '100 kg',
            harvestDate: '2025-09-01',
            status: 'COMPLETED',
            finalized: false,
            transactions: [
                {
                    role: 'Farmer',
                    name: 'Ravi Kumar',
                    location: 'Nashik, MH',
                    timestamp: '2025-09-08T10:00:00Z',
                    handlingInfo: 'Product registered - Mango',
                    transactionId: 'TXN-1725782400000'
                },
                {
                    role: 'Distributor',
                    name: 'Agro Supply Pvt Ltd',
                    location: 'Mumbai, MH',
                    timestamp: '2025-09-10T15:30:00Z',
                    handlingInfo: 'Received from farmer, stored in cold storage',
                    transactionId: 'TXN-1725982200000'
                },
                {
                    role: 'Retailer',
                    name: 'Fresh Mart Store',
                    location: 'Pune, MH',
                    timestamp: '2025-09-12T09:15:00Z',
                    handlingInfo: 'Received from distributor, displayed for sale',
                    transactionId: 'TXN-1726128900000'
                },
                {
                    role: 'Consumer',
                    name: 'Final Consumer',
                    location: 'End User',
                    timestamp: new Date().toISOString(),
                    handlingInfo: consumerInfo || 'Product purchased by consumer',
                    transactionId: `TXN-${Date.now()}`
                }
            ],
            createdAt: '2025-09-08T10:00:00Z',
            updatedAt: new Date().toISOString()
        };

        console.log('Mock: Product completed by consumer', mockProduct);
        return { success: true, product: mockProduct, message: 'Product completed successfully' };
    }

    async mockFinalizeProductChain(productId, consumerInfo) {
        const mockProduct = {
            productId,
            productType: 'Mango',
            batchSize: '100 kg',
            harvestDate: '2025-09-01',
            status: 'FINALIZED',
            finalized: true,
            finalizedAt: new Date().toISOString(),
            finalizedBy: 'Consumer QR Scan',
            transactions: [
                {
                    role: 'Farmer',
                    name: 'Ravi Kumar',
                    location: 'Nashik, MH',
                    timestamp: '2025-09-08T10:00:00Z',
                    handlingInfo: 'Product registered - Mango',
                    transactionId: 'TXN-1725782400000'
                },
                {
                    role: 'Distributor',
                    name: 'Agro Supply Pvt Ltd',
                    location: 'Mumbai, MH',
                    timestamp: '2025-09-10T15:30:00Z',
                    handlingInfo: 'Received from farmer, stored in cold storage',
                    transactionId: 'TXN-1725982200000'
                },
                {
                    role: 'Retailer',
                    name: 'Fresh Mart Store',
                    location: 'Pune, MH',
                    timestamp: '2025-09-12T09:15:00Z',
                    handlingInfo: 'Received from distributor, displayed for sale',
                    transactionId: 'TXN-1726128900000'
                },
                {
                    role: 'Consumer',
                    name: 'QR Scanner',
                    location: 'End Consumer',
                    timestamp: new Date().toISOString(),
                    handlingInfo: 'Blockchain finalized - QR code scanned by consumer',
                    transactionId: `TXN-${Date.now()}`,
                    finalTransaction: true
                }
            ],
            createdAt: '2025-09-08T10:00:00Z',
            updatedAt: new Date().toISOString()
        };

        console.log('Mock: Product chain finalized by consumer QR scan', mockProduct);
        return { success: true, product: mockProduct, message: 'Product blockchain finalized - no further updates allowed' };
    }
}

module.exports = BlockchainService;
