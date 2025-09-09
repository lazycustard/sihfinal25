const express = require('express');
const path = require('path');

const router = express.Router();

// API Documentation and Testing Endpoints
const apiDocumentation = {
    title: "Blockchain Agricultural Traceability System API",
    version: "1.0.0",
    description: "Complete API documentation for the blockchain-based agricultural supply chain traceability system",
    baseUrl: "/api",
    endpoints: {
        authentication: {
            "/auth/login": {
                method: "POST",
                description: "Authenticate user and get JWT token",
                body: {
                    username: "string (required)",
                    password: "string (required)"
                },
                responses: {
                    200: { token: "string", user: "object" },
                    401: { error: "Invalid credentials" }
                }
            },
            "/auth/register": {
                method: "POST",
                description: "Register new user",
                body: {
                    username: "string (required)",
                    password: "string (required)",
                    role: "string (farmer|distributor|retailer|consumer)"
                },
                responses: {
                    201: { message: "User created successfully" },
                    400: { error: "Validation error" }
                }
            }
        },
        blockchain: {
            "/blockchain/register": {
                method: "POST",
                description: "Register a new product on the blockchain",
                headers: { "Authorization": "Bearer <token>" },
                body: {
                    productId: "string (required)",
                    farmerDetails: {
                        name: "string (required)",
                        location: "string (required)",
                        phone: "string",
                        email: "string"
                    },
                    productDetails: {
                        productType: "string (required)",
                        batchSize: "number (required)",
                        harvestDate: "string (ISO date, required)",
                        organicCertified: "boolean",
                        description: "string"
                    }
                },
                responses: {
                    200: { message: "Product registered successfully", productId: "string" },
                    400: { error: "Validation error" },
                    409: { error: "Product already exists" }
                }
            },
            "/blockchain/transfer": {
                method: "POST",
                description: "Transfer product ownership",
                headers: { "Authorization": "Bearer <token>" },
                body: {
                    productId: "string (required)",
                    newOwnerRole: "string (required)",
                    newOwnerName: "string (required)",
                    newOwnerLocation: "string (required)",
                    handlingInfo: "string (required)"
                },
                responses: {
                    200: { message: "Ownership transferred successfully" },
                    404: { error: "Product not found" },
                    400: { error: "Cannot transfer completed product" }
                }
            },
            "/blockchain/history/:productId": {
                method: "GET",
                description: "Get complete product history",
                parameters: { productId: "string (required)" },
                responses: {
                    200: { product: "object", history: "array" },
                    404: { error: "Product not found" }
                }
            },
            "/blockchain/complete": {
                method: "POST",
                description: "Mark product as completed (end of supply chain)",
                headers: { "Authorization": "Bearer <token>" },
                body: {
                    productId: "string (required)",
                    completionInfo: "string"
                },
                responses: {
                    200: { message: "Product completed successfully" },
                    404: { error: "Product not found" }
                }
            },
            "/blockchain/products": {
                method: "GET",
                description: "Get all products with optional filtering",
                query: {
                    status: "string (ACTIVE|COMPLETED)",
                    productType: "string",
                    limit: "number",
                    offset: "number"
                },
                responses: {
                    200: { products: "array", total: "number" }
                }
            }
        },
        qr: {
            "/qr/generate": {
                method: "POST",
                description: "Generate QR code for product",
                body: {
                    productId: "string (required)",
                    size: "number (optional, default: 200)",
                    format: "string (optional, default: png)"
                },
                responses: {
                    200: { qrCode: "base64 string", filename: "string" },
                    400: { error: "Invalid product ID" }
                }
            },
            "/qr/batch": {
                method: "POST",
                description: "Generate multiple QR codes",
                body: {
                    productIds: "array of strings (required)",
                    size: "number (optional)"
                },
                responses: {
                    200: { qrCodes: "array of objects" },
                    400: { error: "Invalid input" }
                }
            },
            "/qr/view/:filename": {
                method: "GET",
                description: "View generated QR code image",
                parameters: { filename: "string (required)" },
                responses: {
                    200: "Image file",
                    404: { error: "QR code not found" }
                }
            }
        },
        sms: {
            "/sms/send": {
                method: "POST",
                description: "Send SMS notification",
                headers: { "Authorization": "Bearer <token>" },
                body: {
                    to: "string (phone number, required)",
                    message: "string (required)",
                    language: "string (en|hi|or, optional)",
                    priority: "string (high|normal|low, optional)"
                },
                responses: {
                    200: { message: "SMS sent successfully", messageId: "string" },
                    400: { error: "Invalid phone number or message" }
                }
            },
            "/sms/status": {
                method: "GET",
                description: "Get SMS service status and queue information",
                responses: {
                    200: {
                        status: "string",
                        queueSize: "number",
                        providers: "array",
                        stats: "object"
                    }
                }
            },
            "/sms/bulk": {
                method: "POST",
                description: "Send bulk SMS notifications",
                headers: { "Authorization": "Bearer <token>" },
                body: {
                    recipients: "array of phone numbers (required)",
                    message: "string (required)",
                    language: "string (optional)"
                },
                responses: {
                    200: { message: "Bulk SMS queued", batchId: "string" },
                    400: { error: "Invalid recipients or message" }
                }
            }
        },
        analytics: {
            "/analytics/dashboard": {
                method: "GET",
                description: "Get analytics dashboard data",
                query: {
                    period: "string (day|week|month|year)",
                    productType: "string (optional)",
                    region: "string (optional)"
                },
                responses: {
                    200: {
                        metrics: "object",
                        charts: "object",
                        recentTransactions: "array"
                    }
                }
            },
            "/analytics/reports": {
                method: "GET",
                description: "Generate analytical reports",
                query: {
                    type: "string (supply-chain|farmer|product)",
                    format: "string (json|csv|pdf)",
                    startDate: "string (ISO date)",
                    endDate: "string (ISO date)"
                },
                responses: {
                    200: "Report data or file",
                    400: { error: "Invalid parameters" }
                }
            }
        },
        iot: {
            "/iot/sensors": {
                method: "GET",
                description: "Get all IoT sensor data",
                query: {
                    location: "string (optional)",
                    sensorType: "string (optional)",
                    hours: "number (optional, default: 24)"
                },
                responses: {
                    200: { sensors: "array", status: "object" }
                }
            },
            "/iot/alerts": {
                method: "GET",
                description: "Get IoT sensor alerts",
                query: {
                    severity: "string (critical|warning|info)",
                    limit: "number (optional)"
                },
                responses: {
                    200: { alerts: "array" }
                }
            },
            "/iot/environmental-report/:productId": {
                method: "GET",
                description: "Get environmental report for product",
                parameters: { productId: "string (required)" },
                responses: {
                    200: { report: "object" },
                    404: { error: "Product not found" }
                }
            }
        },
        system: {
            "/health": {
                method: "GET",
                description: "System health check",
                responses: {
                    200: {
                        status: "healthy|degraded|unhealthy",
                        services: "object",
                        timestamp: "string"
                    }
                }
            },
            "/status": {
                method: "GET",
                description: "System status and metrics",
                responses: {
                    200: {
                        uptime: "number",
                        version: "string",
                        environment: "string",
                        metrics: "object"
                    }
                }
            },
            "/performance": {
                method: "GET",
                description: "Performance metrics and statistics",
                responses: {
                    200: {
                        requests: "object",
                        system: "object",
                        blockchain: "object",
                        suggestions: "array"
                    }
                }
            }
        }
    },
    errorCodes: {
        400: "Bad Request - Invalid input parameters",
        401: "Unauthorized - Invalid or missing authentication token",
        403: "Forbidden - Insufficient permissions",
        404: "Not Found - Resource does not exist",
        409: "Conflict - Resource already exists",
        429: "Too Many Requests - Rate limit exceeded",
        500: "Internal Server Error - Server-side error"
    },
    authentication: {
        type: "JWT Bearer Token",
        header: "Authorization: Bearer <token>",
        description: "Most endpoints require authentication. Include the JWT token in the Authorization header."
    },
    rateLimit: {
        general: "100 requests per 15 minutes per IP",
        authentication: "5 requests per 15 minutes per IP",
        sms: "10 requests per hour per authenticated user"
    }
};

// Test data for API testing
const testData = {
    sampleProduct: {
        productId: "TEST_001",
        farmerDetails: {
            name: "Test Farmer",
            location: "Test Village, Test District",
            phone: "+91-9876543210",
            email: "farmer@test.com"
        },
        productDetails: {
            productType: "Rice",
            batchSize: 100,
            harvestDate: "2024-01-15T00:00:00.000Z",
            organicCertified: true,
            description: "Premium Basmati Rice"
        }
    },
    sampleTransfer: {
        productId: "TEST_001",
        newOwnerRole: "Distributor",
        newOwnerName: "Test Distributor Co.",
        newOwnerLocation: "Test City Warehouse",
        handlingInfo: "Received and stored in temperature-controlled environment"
    },
    sampleSMS: {
        to: "+91-9876543210",
        message: "Your product TEST_001 has been registered successfully.",
        language: "en",
        priority: "normal"
    }
};

// Serve API documentation
router.get('/docs', (req, res) => {
    res.json(apiDocumentation);
});

// Serve interactive documentation page
router.get('/docs/interactive', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Documentation - Blockchain Traceability</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 30px; }
            h3 { color: #7f8c8d; }
            .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #3498db; }
            .method { display: inline-block; padding: 4px 8px; border-radius: 3px; color: white; font-weight: bold; margin-right: 10px; }
            .get { background: #27ae60; }
            .post { background: #e74c3c; }
            .put { background: #f39c12; }
            .delete { background: #c0392b; }
            pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
            .test-section { background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; }
            button { background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
            button:hover { background: #2980b9; }
            .response { background: #f8f9fa; padding: 10px; border-radius: 3px; margin: 10px 0; border-left: 3px solid #28a745; }
            .error { border-left-color: #dc3545; }
            input, textarea { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px; }
            .tab { display: inline-block; padding: 10px 20px; background: #ecf0f1; margin-right: 5px; cursor: pointer; border-radius: 5px 5px 0 0; }
            .tab.active { background: #3498db; color: white; }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌾 Blockchain Agricultural Traceability System API</h1>
            <p><strong>Version:</strong> ${apiDocumentation.version}</p>
            <p>${apiDocumentation.description}</p>
            
            <div class="test-section">
                <h2>🧪 API Testing Interface</h2>
                <div class="tabs">
                    <div class="tab active" onclick="showTab('register')">Register Product</div>
                    <div class="tab" onclick="showTab('transfer')">Transfer Ownership</div>
                    <div class="tab" onclick="showTab('history')">Get History</div>
                    <div class="tab" onclick="showTab('sms')">Send SMS</div>
                </div>
                
                <div id="register" class="tab-content active">
                    <h3>Register New Product</h3>
                    <input type="text" id="reg-productId" placeholder="Product ID" value="TEST_${Date.now()}">
                    <input type="text" id="reg-farmerName" placeholder="Farmer Name" value="Test Farmer">
                    <input type="text" id="reg-location" placeholder="Location" value="Test Village">
                    <input type="text" id="reg-productType" placeholder="Product Type" value="Rice">
                    <input type="number" id="reg-batchSize" placeholder="Batch Size" value="100">
                    <button onclick="testRegisterProduct()">Register Product</button>
                    <div id="reg-response" class="response" style="display:none;"></div>
                </div>
                
                <div id="transfer" class="tab-content">
                    <h3>Transfer Product Ownership</h3>
                    <input type="text" id="trans-productId" placeholder="Product ID">
                    <input type="text" id="trans-role" placeholder="New Owner Role" value="Distributor">
                    <input type="text" id="trans-name" placeholder="New Owner Name" value="Test Distributor">
                    <input type="text" id="trans-location" placeholder="New Owner Location" value="Test Warehouse">
                    <textarea id="trans-info" placeholder="Handling Information">Received and stored properly</textarea>
                    <button onclick="testTransferOwnership()">Transfer Ownership</button>
                    <div id="trans-response" class="response" style="display:none;"></div>
                </div>
                
                <div id="history" class="tab-content">
                    <h3>Get Product History</h3>
                    <input type="text" id="hist-productId" placeholder="Product ID">
                    <button onclick="testGetHistory()">Get History</button>
                    <div id="hist-response" class="response" style="display:none;"></div>
                </div>
                
                <div id="sms" class="tab-content">
                    <h3>Send SMS Notification</h3>
                    <input type="text" id="sms-phone" placeholder="Phone Number" value="+91-9876543210">
                    <textarea id="sms-message" placeholder="Message">Test SMS from Blockchain Traceability System</textarea>
                    <select id="sms-language">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="or">Odia</option>
                    </select>
                    <button onclick="testSendSMS()">Send SMS</button>
                    <div id="sms-response" class="response" style="display:none;"></div>
                </div>
            </div>
            
            <h2>📋 API Endpoints</h2>
            ${generateEndpointHTML()}
            
            <h2>🔐 Authentication</h2>
            <p><strong>Type:</strong> ${apiDocumentation.authentication.type}</p>
            <p><strong>Header:</strong> <code>${apiDocumentation.authentication.header}</code></p>
            <p>${apiDocumentation.authentication.description}</p>
            
            <h2>⚡ Rate Limits</h2>
            <ul>
                <li><strong>General:</strong> ${apiDocumentation.rateLimit.general}</li>
                <li><strong>Authentication:</strong> ${apiDocumentation.rateLimit.authentication}</li>
                <li><strong>SMS:</strong> ${apiDocumentation.rateLimit.sms}</li>
            </ul>
            
            <h2>❌ Error Codes</h2>
            ${generateErrorCodesHTML()}
        </div>
        
        <script>
            function showTab(tabName) {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                event.target.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            }
            
            async function apiCall(endpoint, method, data = null) {
                try {
                    const options = {
                        method,
                        headers: { 'Content-Type': 'application/json' }
                    };
                    if (data) options.body = JSON.stringify(data);
                    
                    const response = await fetch(endpoint, options);
                    const result = await response.json();
                    return { success: response.ok, data: result, status: response.status };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
            
            function showResponse(elementId, result) {
                const element = document.getElementById(elementId);
                element.style.display = 'block';
                element.className = 'response ' + (result.success ? '' : 'error');
                element.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
            }
            
            async function testRegisterProduct() {
                const data = {
                    productId: document.getElementById('reg-productId').value,
                    farmerDetails: {
                        name: document.getElementById('reg-farmerName').value,
                        location: document.getElementById('reg-location').value
                    },
                    productDetails: {
                        productType: document.getElementById('reg-productType').value,
                        batchSize: parseInt(document.getElementById('reg-batchSize').value),
                        harvestDate: new Date().toISOString()
                    }
                };
                const result = await apiCall('/api/blockchain/register', 'POST', data);
                showResponse('reg-response', result);
            }
            
            async function testTransferOwnership() {
                const data = {
                    productId: document.getElementById('trans-productId').value,
                    newOwnerRole: document.getElementById('trans-role').value,
                    newOwnerName: document.getElementById('trans-name').value,
                    newOwnerLocation: document.getElementById('trans-location').value,
                    handlingInfo: document.getElementById('trans-info').value
                };
                const result = await apiCall('/api/blockchain/transfer', 'POST', data);
                showResponse('trans-response', result);
            }
            
            async function testGetHistory() {
                const productId = document.getElementById('hist-productId').value;
                const result = await apiCall('/api/blockchain/history/' + productId, 'GET');
                showResponse('hist-response', result);
            }
            
            async function testSendSMS() {
                const data = {
                    to: document.getElementById('sms-phone').value,
                    message: document.getElementById('sms-message').value,
                    language: document.getElementById('sms-language').value
                };
                const result = await apiCall('/api/sms/send', 'POST', data);
                showResponse('sms-response', result);
            }
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// Generate endpoint HTML
function generateEndpointHTML() {
    let html = '';
    for (const [category, endpoints] of Object.entries(apiDocumentation.endpoints)) {
        html += `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
        for (const [path, details] of Object.entries(endpoints)) {
            const methodClass = details.method.toLowerCase();
            html += `
                <div class="endpoint">
                    <span class="method ${methodClass}">${details.method}</span>
                    <strong>${path}</strong>
                    <p>${details.description}</p>
                    ${details.body ? `<p><strong>Body:</strong> <code>${JSON.stringify(details.body, null, 2)}</code></p>` : ''}
                    ${details.query ? `<p><strong>Query:</strong> <code>${JSON.stringify(details.query, null, 2)}</code></p>` : ''}
                    ${details.parameters ? `<p><strong>Parameters:</strong> <code>${JSON.stringify(details.parameters, null, 2)}</code></p>` : ''}
                    <p><strong>Responses:</strong></p>
                    <pre>${JSON.stringify(details.responses, null, 2)}</pre>
                </div>
            `;
        }
    }
    return html;
}

// Generate error codes HTML
function generateErrorCodesHTML() {
    let html = '<ul>';
    for (const [code, description] of Object.entries(apiDocumentation.errorCodes)) {
        html += `<li><strong>${code}:</strong> ${description}</li>`;
    }
    html += '</ul>';
    return html;
}

// Get test data
router.get('/test-data', (req, res) => {
    res.json(testData);
});

// API testing endpoints
router.post('/test/register', async (req, res) => {
    try {
        // This would call the actual blockchain register endpoint
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/blockchain/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Test failed', details: error.message });
    }
});

// Export router
module.exports = router;
