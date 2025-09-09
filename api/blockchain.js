// Enhanced blockchain service for development (CommonJS)
const path = require('path');
const fs = require('fs');

class BlockchainService {
    constructor() {
        // Mock service - no blockchain connection needed
        console.log('🔧 Using enhanced mock blockchain service for development');
        this.products = new Map();
        this.loadMockData();
    }

    loadMockData() {
        // Load some initial mock data
        const mockProducts = [
            {
                productId: 'P1725782400000-abc123',
                productType: 'Organic Mango',
                batchSize: '100 kg',
                harvestDate: '2025-09-01',
                status: 'ACTIVE',
                finalized: false,
                transactions: [
                    {
                        role: 'Farmer',
                        name: 'Ravi Kumar',
                        location: 'Nashik, MH',
                        timestamp: '2025-09-08T10:00:00Z',
                        handlingInfo: 'Product registered - Organic Mango',
                        transactionId: 'TXN-1725782400000'
                    }
                ],
                createdAt: '2025-09-08T10:00:00Z',
                updatedAt: '2025-09-08T10:00:00Z'
            },
            {
                productId: 'P1725782400001-def456',
                productType: 'Fresh Tomatoes',
                batchSize: '50 kg',
                harvestDate: '2025-09-02',
                status: 'ACTIVE',
                finalized: false,
                transactions: [
                    {
                        role: 'Farmer',
                        name: 'Priya Sharma',
                        location: 'Punjab, India',
                        timestamp: '2025-09-09T08:30:00Z',
                        handlingInfo: 'Product registered - Fresh Tomatoes',
                        transactionId: 'TXN-1725782400001'
                    }
                ],
                createdAt: '2025-09-09T08:30:00Z',
                updatedAt: '2025-09-09T08:30:00Z'
            }
        ];

        mockProducts.forEach(product => {
            this.products.set(product.productId, product);
        });
    }

    async registerProduct(productId, farmerDetails, productDetails) {
        const newProduct = {
            productId,
            productType: productDetails.productType,
            variety: productDetails.variety || 'Standard',
            batchSize: productDetails.batchSize,
            harvestDate: productDetails.harvestDate,
            basePrice: productDetails.basePrice || 0,
            certifications: productDetails.certifications || [],
            status: 'ACTIVE',
            finalized: false,
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

        this.products.set(productId, newProduct);
        console.log('Product registered:', newProduct);
        return { success: true, productId, message: 'Product registered successfully' };
    }

    async transferOwnership(productId, newOwnerRole, newOwnerName, newOwnerLocation, handlingInfo) {
        const product = this.products.get(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        // Check if product is finalized
        if (product.finalized) {
            return { 
                success: false, 
                error: 'Cannot transfer ownership - Product blockchain has been finalized by consumer scan' 
            };
        }

        // Add new transaction
        const newTransaction = {
            role: newOwnerRole,
            name: newOwnerName,
            location: newOwnerLocation,
            timestamp: new Date().toISOString(),
            handlingInfo: handlingInfo || `Ownership transferred to ${newOwnerRole}`,
            transactionId: `TXN-${Date.now()}`
        };

        product.transactions.push(newTransaction);
        product.updatedAt = new Date().toISOString();
        
        console.log(`Ownership transferred for ${productId} to ${newOwnerName}`);
        return { success: true, productId, message: 'Ownership transferred successfully' };
    }

    async getProductHistory(productId) {
        const product = this.products.get(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }
        return { success: true, product };
    }

    async getAllProducts() {
        console.log('Getting all products');
        return Array.from(this.products.values());
    }

    async completeProduct(productId, consumerInfo) {
        const product = this.products.get(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        // Add consumer transaction
        const consumerTransaction = {
            role: 'Consumer',
            name: 'Final Consumer',
            location: 'End User',
            timestamp: new Date().toISOString(),
            handlingInfo: consumerInfo || 'Product purchased by consumer',
            transactionId: `TXN-${Date.now()}`
        };

        product.transactions.push(consumerTransaction);
        product.status = 'COMPLETED';
        product.updatedAt = new Date().toISOString();

        console.log('Product completed by consumer:', product);
        return { success: true, product, message: 'Product completed successfully' };
    }

    async finalizeProductChain(productId, consumerInfo) {
        const product = this.products.get(productId);
        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        // Add final transaction
        const finalTransaction = {
            role: 'Consumer',
            name: 'QR Scanner',
            location: 'End Consumer',
            timestamp: new Date().toISOString(),
            handlingInfo: 'Blockchain finalized - QR code scanned by consumer',
            transactionId: `TXN-${Date.now()}`,
            finalTransaction: true
        };

        product.transactions.push(finalTransaction);
        product.status = 'FINALIZED';
        product.finalized = true;
        product.finalizedAt = new Date().toISOString();
        product.finalizedBy = 'Consumer QR Scan';
        product.updatedAt = new Date().toISOString();

        console.log('Product chain finalized by consumer QR scan:', product);
        return { success: true, product, message: 'Product blockchain finalized - no further updates allowed' };
    }

}

module.exports = BlockchainService;
