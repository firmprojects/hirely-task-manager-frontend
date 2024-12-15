import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Load environment variables
dotenv.config();

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function fetchTasks() {
    try {
        // First, sign in to get the auth token
        const email = process.env.VITE_TEST_USER_EMAIL;
        const password = process.env.VITE_TEST_USER_PASSWORD;
        
        if (!email || !password) {
            throw new Error('Test user credentials not found in environment variables');
        }

        console.log('Signing in with test user...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        console.log('Successfully signed in and got token');
        
        const API_URL = 'https://kelly-task-manager.vercel.app';
        console.log('Fetching tasks from:', `${API_URL}/api/tasks`);
        console.log('Using token:', token.substring(0, 20) + '...');

        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
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
