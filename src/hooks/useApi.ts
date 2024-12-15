import { useAuthStore } from '@/stores/authStore';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  data?: any;
}

export function useApi() {
  const user = useAuthStore((state) => state.user);
  const API_URL = import.meta.env.VITE_API_URL || 'https://kelly-task-manager.vercel.app';

  const fetchWithAuth = useCallback(async (endpoint: string, options: FetchOptions = {}) => {
    if (!user) {
      console.error('Authentication error: User not found');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Getting ID token...');
      const token = await user.getIdToken(true);
      console.log('Token retrieved successfully');

      const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('Fetching from URL:', url);

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      };

      const config: RequestInit = {
        ...options,
        headers,
        mode: 'cors', // Keep CORS mode
      };

      if (options.data) {
        config.body = JSON.stringify(options.data);
      }

      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, [user, API_URL]);

  return { fetchWithAuth };
}
