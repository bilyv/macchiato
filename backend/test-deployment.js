// Simple test script to check if the Cloudflare Worker is deployed
const workerUrl = 'https://macchiato-backend.ntwaribrian262.workers.dev';

async function testDeployment() {
  try {
    console.log('Testing Cloudflare Worker deployment...');
    
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${workerUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await fetch(workerUrl);
    const rootData = await rootResponse.json();
    console.log('Root endpoint:', rootData);
    
    console.log('\n✅ Deployment test completed successfully!');
    console.log(`🚀 Your backend is live at: ${workerUrl}`);
    
  } catch (error) {
    console.error('❌ Deployment test failed:', error.message);
    console.log('\nTrying alternative URLs...');
    
    // Try common subdomain patterns
    const alternativeUrls = [
      'https://macchiato-backend.workers.dev',
      'https://macchiato-backend.ntwaribrian262.workers.dev'
    ];
    
    for (const url of alternativeUrls) {
      try {
        console.log(`Testing: ${url}`);
        const response = await fetch(`${url}/health`);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found working URL: ${url}`);
          console.log('Response:', data);
          return;
        }
      } catch (e) {
        console.log(`❌ ${url} - Not accessible`);
      }
    }
  }
}

testDeployment();
