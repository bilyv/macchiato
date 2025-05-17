// Core API utility functions for making authenticated requests

export interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export const API_BASE_URL = '/api';

// Get the auth token from localStorage
export const getToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;

  try {
    const userData = JSON.parse(user);
    return userData.token;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Make an authenticated API request
export const apiRequest = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
