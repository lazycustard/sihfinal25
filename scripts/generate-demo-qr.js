const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Fix __dirname for this script

// Demo product data
const demoProducts = [
    {
        id: 'DEMO-MANGO-001',
        name: 'Premium Alphonso Mango',
        description: 'Fresh Alphonso mangoes from Maharashtra'
    },
    {
        id: 'DEMO-RICE-002', 
        name: 'Organic Basmati Rice',
        description: 'Premium organic basmati rice from Punjab'
    },
    {
        id: 'DEMO-WHEAT-003',
        name: 'Whole Wheat Grain',
        description: 'Fresh wheat grain from Haryana'
    }
];

function generateDemoQRCodes() {
    console.log('🎯 Generating demo QR codes for product verification...\n');
    
    // Ensure qrcodes directory exists
    const qrDir = path.join(__dirname, 'qrcodes');
    if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
    }

    for (const product of demoProducts) {
        try {
            // Create verification URL that points to our verification page
            const verificationUrl = `http://localhost:3000/qr-verify.html?id=${product.id}`;
            
            // Generate QR code
            const qrCodePath = path.join(qrDir, `${product.id}.png`);
            QRCode.toFile(qrCodePath, verificationUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            console.log(`✅ Generated QR code for ${product.name}`);
            console.log(`   Product ID: ${product.id}`);
            console.log(`   QR Code: ${qrCodePath}`);
            console.log(`   Verification URL: ${verificationUrl}`);
            console.log(`   Description: ${product.description}\n`);

        } catch (error) {
            console.error(`❌ Failed to generate QR code for ${product.id}:`, error.message);
        }
    }

    // Generate HTML page to display all QR codes
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo QR Codes - AgriTrace</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .title {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            color: #7f8c8d;
            font-size: 1.2rem;
        }
        
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .qr-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            border: 2px solid #e9ecef;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .qr-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .qr-image {
            width: 200px;
            height: 200px;
            margin: 0 auto 1rem;
            border: 3px solid #28a745;
            border-radius: 10px;
            padding: 10px;
            background: white;
        }
        
        .product-name {
            font-size: 1.3rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .product-id {
            font-family: 'Courier New', monospace;
            background: #e9ecef;
            padding: 0.5rem;
            border-radius: 5px;
            margin: 0.5rem 0;
            color: #495057;
        }
        
        .product-description {
            color: #6c757d;
            margin-bottom: 1rem;
        }
        
        .scan-instruction {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            font-weight: 500;
        }
        
        .instructions {
            background: #e8f4fd;
            border: 1px solid #b8daff;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        
        .instructions h3 {
            color: #004085;
            margin-top: 0;
        }
        
        .instruction-list {
            color: #004085;
            line-height: 1.6;
        }
        
        .demo-badge {
            background: #ffc107;
            color: #212529;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🎯 Demo QR Codes</div>
            <div class="subtitle">AgriTrace Blockchain Product Verification</div>
        </div>
        
        <div class="instructions">
            <h3>📱 How to Test QR Code Scanning:</h3>
            <ol class="instruction-list">
                <li><strong>Mobile Testing:</strong> Use your phone's camera or QR scanner app to scan any QR code below</li>
                <li><strong>Desktop Testing:</strong> Click on any QR code image to open the verification page</li>
                <li><strong>Automatic Finalization:</strong> When scanned, the blockchain will be automatically finalized</li>
                <li><strong>Consumer Access:</strong> QR codes work without login - perfect for end consumers</li>
                <li><strong>Complete History:</strong> View the entire supply chain journey from farm to consumer</li>
            </ol>
        </div>
        
        <div class="qr-grid">
            ${demoProducts.map(product => `
                <div class="qr-card">
                    <div class="demo-badge">DEMO PRODUCT</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-id">ID: ${product.id}</div>
                    <div class="product-description">${product.description}</div>
                    <a href="/qr-verify.html?id=${product.id}" target="_blank">
                        <img src="qrcodes/${product.id}.png" alt="QR Code for ${product.name}" class="qr-image">
                    </a>
                    <div class="scan-instruction">
                        📱 Scan with your phone camera<br>
                        🖱️ Or click to test on desktop
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="instructions">
            <h3>🔒 Blockchain Finalization Feature:</h3>
            <div class="instruction-list">
                <p><strong>Important:</strong> When a consumer scans any QR code, the blockchain for that product is automatically <strong>finalized</strong>. This means:</p>
                <ul>
                    <li>✅ The supply chain record becomes permanently sealed</li>
                    <li>🚫 No further transfers or updates are possible</li>
                    <li>🔒 The blockchain integrity is preserved</li>
                    <li>📋 Complete traceability history remains accessible</li>
                </ul>
                <p>This ensures that once a product reaches the end consumer, its blockchain record cannot be tampered with.</p>
            </div>
        </div>
    </div>
</body>
</html>`;

    // Save the HTML file
    const htmlPath = path.join(__dirname, 'public', 'demo-qr-codes.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log('📄 Generated demo QR codes display page:');
    console.log(`   File: ${htmlPath}`);
    console.log(`   URL: http://localhost:3000/demo-qr-codes.html\n`);
    
    console.log('🎉 Demo QR code generation completed!');
    console.log('\n📋 Summary:');
    console.log(`   • Generated ${demoProducts.length} QR codes`);
    console.log('   • Each QR code points to the verification page');
    console.log('   • Scanning automatically finalizes the blockchain');
    console.log('   • Works without authentication (consumer-friendly)');
    console.log('   • Complete supply chain history displayed');
    console.log('\n🚀 To test:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Visit: http://localhost:3000/demo-qr-codes.html');
    console.log('   3. Scan any QR code with your phone');
    console.log('   4. See the blockchain finalization in action!');
}

// Run the QR code generation
generateDemoQRCodes();
