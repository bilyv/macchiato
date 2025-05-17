// Simple script to test creating a notification bar using native fetch
async function createNotification() {
  try {
    const response = await fetch('http://localhost:3000/api/notification-bars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Welcome to Macchiato Suites! Book now and get 15% off your stay.',
        type: 'info',
        is_active: true
      })
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Run the function
createNotification();
