import { useAuthStore } from '@/stores/authStore';

interface FetchOptions extends RequestInit {
  data?: any;
}

export function useApi() {
  const user = useAuthStore((state) => state.user);
  const API_URL = import.meta.env.VITE_API_URL || 'https://kelly-task-manager.vercel.app/api';

  const fetchWithAuth = async (endpoint: string, options: FetchOptions = {}) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.data) {
      config.body = JSON.stringify(options.data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  };

  return { fetchWithAuth };
}
