// Basic test script for the Blockchain Traceability System
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting System Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test 2: API Status
    console.log('\n2️⃣ Testing API Status...');
    const statusResponse = await axios.get(`${BASE_URL}/api/status`);
    console.log('✅ API status:', statusResponse.data.status);

    // Test 3: Product Registration
    console.log('\n3️⃣ Testing Product Registration...');
    const productData = {
      farmerDetails: {
        name: 'John Farmer',
        location: 'Punjab, India',
        contact: '+91-9876543210'
      },
      productDetails: {
        name: 'Organic Wheat',
        variety: 'Durum',
        quantity: '100 kg',
        harvestDate: '2024-09-01',
        certifications: ['Organic', 'Non-GMO']
      }
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/products/register`, productData);
    const productId = registerResponse.data.productId;
    console.log('✅ Product registered:', productId);

    // Test 4: QR Code Generation
    console.log('\n4️⃣ Testing QR Code Generation...');
    const qrResponse = await axios.get(`${BASE_URL}/api/qr/${productId}`);
    console.log('✅ QR code generated for product:', productId);

    // Test 5: Product History
    console.log('\n5️⃣ Testing Product History...');
    const historyResponse = await axios.get(`${BASE_URL}/api/products/${productId}/history`);
    console.log('✅ Product history retrieved:', historyResponse.data.transactions?.length || 0, 'transactions');

    // Test 6: Ownership Transfer
    console.log('\n6️⃣ Testing Ownership Transfer...');
    const transferData = {
      newOwnerDetails: {
        name: 'ABC Distributors',
        type: 'distributor',
        location: 'Delhi, India',
        contact: '+91-9876543211'
      },
      transferDate: new Date().toISOString(),
      notes: 'Quality checked and approved'
    };

    const transferResponse = await axios.post(`${BASE_URL}/api/products/${productId}/transfer`, transferData);
    console.log('✅ Ownership transferred successfully');

    // Test 7: Product Completion
    console.log('\n7️⃣ Testing Product Completion...');
    const completionData = {
      consumerInfo: {
        name: 'Jane Consumer',
        location: 'Mumbai, India',
        purchaseDate: new Date().toISOString()
      },
      retailerInfo: {
        name: 'XYZ Retail Store',
        location: 'Mumbai, India'
      }
    };

    const completionResponse = await axios.post(`${BASE_URL}/api/products/${productId}/complete`, completionData);
    console.log('✅ Product journey completed');

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Health Check');
    console.log('✅ API Status');
    console.log('✅ Product Registration');
    console.log('✅ QR Code Generation');
    console.log('✅ Product History');
    console.log('✅ Ownership Transfer');
    console.log('✅ Product Completion');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('🚀 Server is running, starting tests...\n');
    return true;
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first:');
    console.error('   npm start');
    console.error('   or');
    console.error('   docker-compose -f docker-compose.dev.yml up');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
})();
