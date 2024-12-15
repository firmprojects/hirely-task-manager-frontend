import { useAuthStore } from '@/stores/authStore';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  data?: any;
}

const API_URL = 'https://hirely-taskmanager-frontend.netlify.app';

export function useApi() {
  const user = useAuthStore((state) => state.user);

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

      // Basic headers that work with CORS
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Only add Content-Type for requests with body
      if (options.data) {
        headers['Content-Type'] = 'application/json';
      }

      const config: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        },
        mode: 'cors',
        cache: 'no-cache',
        referrerPolicy: 'no-referrer'
      };

      if (options.data) {
        config.body = JSON.stringify(options.data);
      }

      console.log('Making request with config:', {
        url,
        method: config.method || 'GET',
        headers: config.headers,
        mode: config.mode
      });

      const response = await fetch(url, config);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching data');
    }
  }, [user]);

  return { fetchWithAuth };
}
