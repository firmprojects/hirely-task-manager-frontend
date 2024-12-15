// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const firebase = require('firebase/app');
const auth = require('firebase/auth');
const app = firebase.initializeApp(firebaseConfig);
const authInstance = auth.getAuth(app);

async function fetchTasks() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://kelly-task-manager.vercel.app';
    console.log('Fetching tasks from:', `${API_URL}/tasks`);

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // Note: In a real frontend app, you would include the Firebase token
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();
    console.log('Tasks fetched successfully:');
    console.log(JSON.stringify(tasks, null, 2));

    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

// Run the test
fetchTasks()
  .then(() => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
