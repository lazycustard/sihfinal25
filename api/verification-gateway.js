const express = require('express');
const { logger } = require('../utils/logger.js');
const { authenticateToken } = require('./auth.js');

const router = express.Router();

// Verification Gateway for Real-time ID and Credibility Checks
class VerificationGateway {
    constructor() {
        this.verificationCache = new Map();
        this.credibilityScores = new Map();
        
        // Initialize with government API endpoints
        this.governmentAPIs = {
            // Odisha Government APIs
            FARMER_DB: {
                url: 'https://agri.odisha.gov.in/api/farmer-verification',
                headers: { 'X-API-Key': process.env.ODISHA_FARMER_API_KEY }
            },
            LAND_RECORDS: {
                url: 'https://bhulekh.ori.nic.in/api/land-verification',
                headers: { 'X-API-Key': process.env.BHULEKH_API_KEY }
            },
            DISTRIBUTOR_LICENSE: {
                url: 'https://commerce.odisha.gov.in/api/license-verification',
                headers: { 'X-API-Key': process.env.COMMERCE_API_KEY }
            },
            // Central Government APIs
            AADHAAR_VERIFICATION: {
                url: 'https://resident.uidai.gov.in/api/verify',
                headers: { 'X-API-Key': process.env.UIDAI_API_KEY }
            },
            GST_VERIFICATION: {
                url: 'https://api.gst.gov.in/taxpayerapi/search',
                headers: { 'X-API-Key': process.env.GST_API_KEY }
            },
            FSSAI_VERIFICATION: {
                url: 'https://foscos.fssai.gov.in/api/license-verify',
                headers: { 'X-API-Key': process.env.FSSAI_API_KEY }
            }
        };
    }

    // Comprehensive Farmer Verification
    async verifyFarmer(farmerData) {
        const { farmerId, aadhaarNumber, name, district, village } = farmerData;
        
        try {
            // Multi-source verification
            const verificationResults = await Promise.allSettled([
                this.verifyWithOdishaFarmerDB(farmerId, name, district),
                this.verifyLandRecords(farmerId, district, village),
                this.verifyAadhaar(aadhaarNumber, name),
                this.checkKCCStatus(farmerId),
                this.checkSubsidyHistory(farmerId)
            ]);

            const verification = this.processVerificationResults(verificationResults, 'farmer');
            
            // Calculate credibility score
            verification.credibilityScore = this.calculateCredibilityScore(verification, 'farmer');
            
            // Cache result
            this.verificationCache.set(`farmer_${farmerId}`, {
                ...verification,
                timestamp: Date.now(),
                ttl: 24 * 60 * 60 * 1000 // 24 hours
            });

            return verification;
        } catch (error) {
            logger.error('Farmer verification failed:', error);
            throw new Error('Verification service unavailable');
        }
    }

    // Distributor/Retailer Business Verification
    async verifyBusiness(businessData) {
        const { licenseNumber, gstNumber, fssaiNumber, businessName, ownerName } = businessData;
        
        try {
            const verificationResults = await Promise.allSettled([
                this.verifyBusinessLicense(licenseNumber, businessName),
                this.verifyGST(gstNumber, businessName),
                this.verifyFSSAI(fssaiNumber, businessName),
                this.checkBusinessHistory(licenseNumber),
                this.verifyOwnerKYC(ownerName)
            ]);

            const verification = this.processVerificationResults(verificationResults, 'business');
            verification.credibilityScore = this.calculateCredibilityScore(verification, 'business');
            
            this.verificationCache.set(`business_${licenseNumber}`, {
                ...verification,
                timestamp: Date.now(),
                ttl: 24 * 60 * 60 * 1000
            });

            return verification;
        } catch (error) {
            logger.error('Business verification failed:', error);
            throw new Error('Business verification service unavailable');
        }
    }

    // Mock API calls (replace with actual government API integrations)
    async verifyWithOdishaFarmerDB(farmerId, name, district) {
        // Simulate API call to Odisha Agriculture Department
        await this.simulateAPIDelay();
        
        return {
            source: 'Odisha Farmer Database',
            verified: true,
            details: {
                farmerId,
                registeredName: name,
                district,
                registrationDate: '2020-03-15',
                landHolding: '2.5 acres',
                crops: ['Rice', 'Wheat', 'Vegetables'],
                status: 'Active'
            }
        };
    }

    async verifyLandRecords(farmerId, district, village) {
        await this.simulateAPIDelay();
        
        return {
            source: 'Bhulekh Land Records',
            verified: true,
            details: {
                surveyNumber: 'SY/123/456',
                area: '2.5 acres',
                landType: 'Agricultural',
                ownershipType: 'Patta',
                village,
                district
            }
        };
    }

    async verifyAadhaar(aadhaarNumber, name) {
        await this.simulateAPIDelay();
        
        return {
            source: 'UIDAI Aadhaar Verification',
            verified: true,
            details: {
                aadhaarVerified: true,
                nameMatch: true,
                lastUpdated: '2023-12-01'
            }
        };
    }

    async checkKCCStatus(farmerId) {
        await this.simulateAPIDelay();
        
        return {
            source: 'Kisan Credit Card System',
            verified: true,
            details: {
                kccNumber: 'KCC123456789',
                sanctionedAmount: '₹2,00,000',
                status: 'Active',
                bank: 'State Bank of India'
            }
        };
    }

    async checkSubsidyHistory(farmerId) {
        await this.simulateAPIDelay();
        
        return {
            source: 'Subsidy Management System',
            verified: true,
            details: {
                pmKisanEnrolled: true,
                kaliaYojanaEnrolled: true,
                cropInsurance: true,
                lastSubsidyReceived: '2024-08-15'
            }
        };
    }

    async verifyBusinessLicense(licenseNumber, businessName) {
        await this.simulateAPIDelay();
        
        return {
            source: 'Business License Registry',
            verified: true,
            details: {
                licenseNumber,
                businessName,
                licenseType: 'Food Grain Dealer',
                issueDate: '2022-01-15',
                validUntil: '2025-01-14',
                status: 'Active'
            }
        };
    }

    async verifyGST(gstNumber, businessName) {
        await this.simulateAPIDelay();
        
        return {
            source: 'GST Network',
            verified: true,
            details: {
                gstNumber,
                legalName: businessName,
                registrationDate: '2022-02-01',
                status: 'Active',
                filingStatus: 'Regular'
            }
        };
    }

    async verifyFSSAI(fssaiNumber, businessName) {
        await this.simulateAPIDelay();
        
        return {
            source: 'FSSAI License System',
            verified: true,
            details: {
                fssaiNumber,
                businessName,
                licenseType: 'Food Business Operator',
                validUntil: '2025-06-30',
                status: 'Active'
            }
        };
    }

    async checkBusinessHistory(licenseNumber) {
        await this.simulateAPIDelay();
        
        return {
            source: 'Business History Records',
            verified: true,
            details: {
                yearsInBusiness: 3,
                complianceRecord: 'Good',
                violations: 0,
                certifications: ['ISO 9001', 'HACCP']
            }
        };
    }

    async verifyOwnerKYC(ownerName) {
        await this.simulateAPIDelay();
        
        return {
            source: 'KYC Verification System',
            verified: true,
            details: {
                kycCompleted: true,
                documentsVerified: ['PAN', 'Aadhaar', 'Bank Account'],
                riskCategory: 'Low'
            }
        };
    }

    processVerificationResults(results, type) {
        const verification = {
            overallStatus: 'verified',
            verificationDate: new Date().toISOString(),
            sources: [],
            failedChecks: [],
            warnings: []
        };

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                verification.sources.push(result.value);
            } else {
                verification.failedChecks.push({
                    source: `Check ${index + 1}`,
                    error: result.reason.message
                });
            }
        });

        // Determine overall status
        const successRate = verification.sources.length / results.length;
        if (successRate >= 0.8) {
            verification.overallStatus = 'verified';
        } else if (successRate >= 0.6) {
            verification.overallStatus = 'partially_verified';
            verification.warnings.push('Some verification checks failed');
        } else {
            verification.overallStatus = 'unverified';
        }

        return verification;
    }

    calculateCredibilityScore(verification, type) {
        let baseScore = 50;
        
        // Add points for successful verifications
        verification.sources.forEach(source => {
            if (source.verified) {
                baseScore += 10;
            }
        });

        // Deduct points for failed checks
        baseScore -= verification.failedChecks.length * 5;

        // Type-specific bonuses
        if (type === 'farmer') {
            verification.sources.forEach(source => {
                if (source.source.includes('KCC')) baseScore += 5;
                if (source.source.includes('Subsidy')) baseScore += 5;
                if (source.source.includes('Land Records')) baseScore += 10;
            });
        } else if (type === 'business') {
            verification.sources.forEach(source => {
                if (source.source.includes('GST')) baseScore += 8;
                if (source.source.includes('FSSAI')) baseScore += 7;
                if (source.details?.complianceRecord === 'Good') baseScore += 10;
            });
        }

        return Math.min(Math.max(baseScore, 0), 100);
    }

    async simulateAPIDelay() {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    }

    // Get cached verification result
    getCachedVerification(key) {
        const cached = this.verificationCache.get(key);
        if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
            return cached;
        }
        this.verificationCache.delete(key);
        return null;
    }
}

const verificationGateway = new VerificationGateway();

// API Endpoints

// Comprehensive Farmer Verification
router.post('/verify-farmer-comprehensive', authenticateToken, async (req, res) => {
    try {
        const { farmerId, aadhaarNumber, name, district, village } = req.body;

        if (!farmerId || !aadhaarNumber || !name) {
            return res.status(400).json({ 
                error: 'Farmer ID, Aadhaar number, and name are required' 
            });
        }

        // Check cache first
        const cached = verificationGateway.getCachedVerification(`farmer_${farmerId}`);
        if (cached) {
            return res.json({
                success: true,
                verification: cached,
                cached: true
            });
        }

        const verification = await verificationGateway.verifyFarmer({
            farmerId, aadhaarNumber, name, district, village
        });

        logger.info('Comprehensive farmer verification completed', { 
            farmerId, 
            status: verification.overallStatus,
            credibilityScore: verification.credibilityScore 
        });

        res.json({
            success: true,
            verification,
            cached: false
        });

    } catch (error) {
        logger.error('Comprehensive farmer verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Business Verification (Distributors/Retailers)
router.post('/verify-business-comprehensive', authenticateToken, async (req, res) => {
    try {
        const { licenseNumber, gstNumber, fssaiNumber, businessName, ownerName } = req.body;

        if (!licenseNumber || !businessName) {
            return res.status(400).json({ 
                error: 'License number and business name are required' 
            });
        }

        const cached = verificationGateway.getCachedVerification(`business_${licenseNumber}`);
        if (cached) {
            return res.json({
                success: true,
                verification: cached,
                cached: true
            });
        }

        const verification = await verificationGateway.verifyBusiness({
            licenseNumber, gstNumber, fssaiNumber, businessName, ownerName
        });

        logger.info('Comprehensive business verification completed', { 
            licenseNumber, 
            status: verification.overallStatus,
            credibilityScore: verification.credibilityScore 
        });

        res.json({
            success: true,
            verification,
            cached: false
        });

    } catch (error) {
        logger.error('Comprehensive business verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Credibility Badge
router.get('/credibility-badge/:userType/:userId', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        
        const cached = verificationGateway.getCachedVerification(`${userType}_${userId}`);
        if (!cached) {
            return res.status(404).json({ error: 'Verification not found' });
        }

        const badge = {
            userId,
            userType,
            credibilityScore: cached.credibilityScore,
            badge: getBadgeLevel(cached.credibilityScore),
            verificationStatus: cached.overallStatus,
            lastVerified: cached.verificationDate,
            trustLevel: getTrustLevel(cached.credibilityScore)
        };

        res.json({
            success: true,
            badge
        });

    } catch (error) {
        logger.error('Credibility badge error:', error);
        res.status(500).json({ error: 'Badge service unavailable' });
    }
});

// Verification Status Dashboard
router.get('/verification-dashboard', authenticateToken, async (req, res) => {
    try {
        const stats = {
            totalVerifications: verificationGateway.verificationCache.size,
            verificationsByType: {
                farmer: 0,
                business: 0
            },
            averageCredibilityScore: 0,
            verificationTrends: []
        };

        // Calculate statistics from cache
        let totalScore = 0;
        for (const [key, verification] of verificationGateway.verificationCache.entries()) {
            if (key.startsWith('farmer_')) {
                stats.verificationsByType.farmer++;
            } else if (key.startsWith('business_')) {
                stats.verificationsByType.business++;
            }
            totalScore += verification.credibilityScore || 0;
        }

        if (stats.totalVerifications > 0) {
            stats.averageCredibilityScore = Math.round(totalScore / stats.totalVerifications);
        }

        res.json({
            success: true,
            dashboard: stats
        });

    } catch (error) {
        logger.error('Verification dashboard error:', error);
        res.status(500).json({ error: 'Dashboard service unavailable' });
    }
});

// Helper Functions
function getBadgeLevel(score) {
    if (score >= 90) return 'platinum';
    if (score >= 80) return 'gold';
    if (score >= 70) return 'silver';
    if (score >= 60) return 'bronze';
    return 'basic';
}

function getTrustLevel(score) {
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    if (score >= 50) return 'low';
    return 'unverified';
}

module.exports = router;
