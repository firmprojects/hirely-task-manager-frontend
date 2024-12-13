import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // Changed to local development server
  headers: {
    'Content-Type': 'application/json',
  },
});

async function createUser() {
  const userData = {
    id: "test-user-" + Date.now(), // Generate a unique ID
    email: "test@example.com",
    name: "Test User"
  };

  try {
    console.log('Sending request with data:', userData);
    const response = await api.post('/api/users', userData, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response?.status);
    console.error('Error details:', error.response?.data);
  }
}

createUser();
