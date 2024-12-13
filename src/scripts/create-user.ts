interface UserData {
  id: string;
  email: string;
  name: string;
}

async function createUser() {
  const userData: UserData = {
    id: "test-user-" + Date.now(), // Generate a unique ID
    email: "test@example.com",
    name: "Test User"
  };

  try {
    const response = await fetch('https://hirely-task-manager-backend.vercel.app/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

createUser();
