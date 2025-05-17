// Script to test login functionality with global fetch
// Node.js v18+ has built-in fetch

// Admin user credentials
const credentials = {
  email: 'boss@gmail.com',
  password: 'boss123'
};

// Function to test login
const testLogin = async () => {
  try {
    console.log('Testing login with admin credentials...');

    // Make login request
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Parse response
    const data = await response.json();

    if (response.ok) {
      console.log('Login successful!');
      console.log('User details:');
      console.log(`ID: ${data.data.id}`);
      console.log(`Email: ${data.data.email}`);
      console.log(`Name: ${data.data.firstName} ${data.data.lastName}`);
      console.log(`Role: ${data.data.role}`);
      console.log('JWT Token (first 20 chars):', data.data.token.substring(0, 20) + '...');
    } else {
      console.error('Login failed:', data.message || data.status);
      console.error('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error testing login:', error);
  }
};

// Execute the function
testLogin();
