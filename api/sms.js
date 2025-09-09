const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// SMS Service for offline areas
class SMSService {
    constructor() {
        this.offlineQueue = [];
        this.smsProviders = {
            // Multiple SMS providers for reliability
            textlocal: {
                apiKey: process.env.TEXTLOCAL_API_KEY || 'demo_key',
                sender: 'BLKCHN',
                baseUrl: 'https://api.textlocal.in/send/'
            },
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID || 'demo_sid',
                authToken: process.env.TWILIO_AUTH_TOKEN || 'demo_token',
                phoneNumber: process.env.TWILIO_PHONE || '+1234567890'
            },
            msg91: {
                authKey: process.env.MSG91_AUTH_KEY || 'demo_key',
                sender: 'BLKCHN',
                route: '4'
            }
        };
        
        // Load offline queue from file
        this.loadOfflineQueue();
        
        // Process offline queue every 30 seconds
        setInterval(() => this.processOfflineQueue(), 30000);
    }

    async sendSMS(phoneNumber, message, priority = 'normal') {
        const smsData = {
            phoneNumber: this.formatPhoneNumber(phoneNumber),
            message: this.truncateMessage(message),
            timestamp: new Date().toISOString(),
            priority,
            attempts: 0,
            maxAttempts: 3
        };

        try {
            // Try to send immediately
            const result = await this.attemptSMSSend(smsData);
            if (result.success) {
                console.log(`SMS sent successfully to ${phoneNumber}`);
                return result;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.log(`SMS failed, adding to offline queue: ${error.message}`);
            // Add to offline queue for retry
            this.addToOfflineQueue(smsData);
            return { success: false, queued: true, error: error.message };
        }
    }

    async attemptSMSSend(smsData) {
        // Try different providers in order of preference
        const providers = ['textlocal', 'msg91', 'twilio'];
        
        for (const provider of providers) {
            try {
                const result = await this.sendViProvider(provider, smsData);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.log(`Provider ${provider} failed: ${error.message}`);
                continue;
            }
        }
        
        throw new Error('All SMS providers failed');
    }

    async sendViProvider(provider, smsData) {
        // Mock SMS sending for demo - replace with actual provider APIs
        console.log(`[${provider.toUpperCase()}] Sending SMS to ${smsData.phoneNumber}: ${smsData.message}`);
        
        // Simulate network delay and occasional failures
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        
        if (Math.random() > 0.1) { // 90% success rate for demo
            return {
                success: true,
                provider,
                messageId: `${provider}_${Date.now()}`,
                timestamp: new Date().toISOString()
            };
        } else {
            throw new Error(`${provider} service temporarily unavailable`);
        }
    }

    formatPhoneNumber(phone) {
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, '');
        
        // Add country code if missing (assuming India +91)
        if (cleaned.length === 10) {
            cleaned = '91' + cleaned;
        }
        
        return '+' + cleaned;
    }

    truncateMessage(message) {
        // SMS limit is typically 160 characters
        if (message.length <= 160) {
            return message;
        }
        return message.substring(0, 157) + '...';
    }

    addToOfflineQueue(smsData) {
        this.offlineQueue.push(smsData);
        this.saveOfflineQueue();
    }

    async processOfflineQueue() {
        if (this.offlineQueue.length === 0) return;

        console.log(`Processing ${this.offlineQueue.length} queued SMS messages`);
        
        const toRetry = [];
        
        for (const smsData of this.offlineQueue) {
            try {
                const result = await this.attemptSMSSend(smsData);
                if (result.success) {
                    console.log(`Queued SMS sent successfully to ${smsData.phoneNumber}`);
                } else {
                    smsData.attempts++;
                    if (smsData.attempts < smsData.maxAttempts) {
                        toRetry.push(smsData);
                    } else {
                        console.log(`SMS to ${smsData.phoneNumber} failed after ${smsData.maxAttempts} attempts`);
                    }
                }
            } catch (error) {
                smsData.attempts++;
                if (smsData.attempts < smsData.maxAttempts) {
                    toRetry.push(smsData);
                } else {
                    console.log(`SMS to ${smsData.phoneNumber} failed permanently: ${error.message}`);
                }
            }
        }
        
        this.offlineQueue = toRetry;
        this.saveOfflineQueue();
    }

    saveOfflineQueue() {
        try {
            const queueFile = path.join(__dirname, '..', 'data', 'sms_queue.json');
            const dir = path.dirname(queueFile);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(queueFile, JSON.stringify(this.offlineQueue, null, 2));
        } catch (error) {
            console.error('Failed to save SMS queue:', error);
        }
    }

    loadOfflineQueue() {
        try {
            const queueFile = path.join(__dirname, '..', 'data', 'sms_queue.json');
            if (fs.existsSync(queueFile)) {
                const data = fs.readFileSync(queueFile, 'utf8');
                this.offlineQueue = JSON.parse(data);
                console.log(`Loaded ${this.offlineQueue.length} queued SMS messages`);
            }
        } catch (error) {
            console.error('Failed to load SMS queue:', error);
            this.offlineQueue = [];
        }
    }

    generateProductSMS(productId, action, details = {}) {
        const messages = {
            en: {
                registered: `Product ${productId} registered successfully. Verify at: ${details.verifyUrl}`,
                transferred: `Product ${productId} ownership transferred to ${details.newOwner}. Track at: ${details.verifyUrl}`,
                verified: `Product ${productId} verified by consumer. Supply chain complete.`,
                alert: `ALERT: Product ${productId} requires attention. Check dashboard immediately.`
            },
            hi: {
                registered: `उत्पाद ${productId} सफलतापूर्वक पंजीकृत। सत्यापित करें: ${details.verifyUrl}`,
                transferred: `उत्पाद ${productId} का स्वामित्व ${details.newOwner} को स्थानांतरित। ट्रैक करें: ${details.verifyUrl}`,
                verified: `उत्पाद ${productId} उपभोक्ता द्वारा सत्यापित। आपूर्ति श्रृंखला पूर्ण।`,
                alert: `चेतावनी: उत्पाद ${productId} पर ध्यान देने की आवश्यकता। तुरंत डैशबोर्ड जांचें।`
            },
            or: {
                registered: `ଉତ୍ପାଦ ${productId} ସଫଳଭାବେ ପଞ୍ଜୀକୃତ। ଯାଞ୍ଚ କରନ୍ତୁ: ${details.verifyUrl}`,
                transferred: `ଉତ୍ପାଦ ${productId} ର ମାଲିକାନା ${details.newOwner} କୁ ସ୍ଥାନାନ୍ତରିତ। ଟ୍ରାକ୍ କରନ୍ତୁ: ${details.verifyUrl}`,
                verified: `ଉତ୍ପାଦ ${productId} ଗ୍ରାହକଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ କରାଯାଇଛି। ଯୋଗାଣ ଶୃଙ୍ଖଳା ସମ୍ପୂର୍ଣ୍ଣ।`,
                alert: `ସତର୍କତା: ଉତ୍ପାଦ ${productId} ଧ୍ୟାନ ଆବଶ୍ୟକ। ତୁରନ୍ତ ଡ୍ୟାସବୋର୍ଡ ଯାଞ୍ଚ କରନ୍ତୁ।`
            }
        };

        const language = details.language || 'en';
        return messages[language]?.[action] || messages.en[action];
    }

    getQueueStatus() {
        return {
            queueLength: this.offlineQueue.length,
            oldestMessage: this.offlineQueue.length > 0 ? this.offlineQueue[0].timestamp : null,
            totalAttempts: this.offlineQueue.reduce((sum, msg) => sum + msg.attempts, 0)
        };
    }
}

const smsService = new SMSService();

// SMS API Routes

// Send SMS notification
router.post('/sms/send', async (req, res) => {
    try {
        const { phoneNumber, message, priority = 'normal' } = req.body;
        
        if (!phoneNumber || !message) {
            return res.status(400).json({ 
                error: 'Phone number and message are required' 
            });
        }

        const result = await smsService.sendSMS(phoneNumber, message, priority);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send product notification SMS
router.post('/sms/product-notification', async (req, res) => {
    try {
        const { productId, action, phoneNumber, details = {}, language = 'en' } = req.body;
        
        if (!productId || !action || !phoneNumber) {
            return res.status(400).json({ 
                error: 'Product ID, action, and phone number are required' 
            });
        }

        const message = smsService.generateProductSMS(productId, action, { ...details, language });
        const result = await smsService.sendSMS(phoneNumber, message, 'high');
        
        res.json({ ...result, message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get SMS queue status
router.get('/sms/queue-status', (req, res) => {
    try {
        const status = smsService.getQueueStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk SMS for farmers in an area
router.post('/sms/bulk-notify', async (req, res) => {
    try {
        const { phoneNumbers, message, language = 'en' } = req.body;
        
        if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            return res.status(400).json({ 
                error: 'Phone numbers array is required' 
            });
        }

        const results = [];
        for (const phoneNumber of phoneNumbers) {
            try {
                const result = await smsService.sendSMS(phoneNumber, message, 'normal');
                results.push({ phoneNumber, ...result });
            } catch (error) {
                results.push({ phoneNumber, success: false, error: error.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const queuedCount = results.filter(r => r.queued).length;
        
        res.json({
            total: phoneNumbers.length,
            successful: successCount,
            queued: queuedCount,
            failed: phoneNumbers.length - successCount - queuedCount,
            results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
