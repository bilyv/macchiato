// Core API utility functions for making authenticated requests

export interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

// Use environment variable for backend URL in production, fallback to proxy in development
// When using full backend URL, append /api path; when using proxy, /api is already the path
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

// Debug logging for API configuration
console.log('🔧 API Configuration:', {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  API_BASE_URL,
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

// Additional warning if using proxy in production
if (import.meta.env.PROD && API_BASE_URL === '/api') {
  console.warn('⚠️ WARNING: Using proxy URL in production! Set VITE_BACKEND_URL environment variable.');
}

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
  };

  // Add body to request if provided
  if (options.body) {
    // If it's FormData, don't stringify and remove Content-Type header
    // to let the browser set it with the correct boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, config);

    // Get response text first to handle empty responses
    const responseText = await response.text();

    if (!response.ok) {
      let errorData: any = {};
      if (responseText) {
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.warn('Response is not valid JSON:', responseText);
          errorData = { message: responseText || `HTTP ${response.status}` };
        }
      }
      throw new Error(errorData.message || `API request failed with status ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content responses or empty responses
    if (response.status === 204 || !responseText) {
      return {} as T;
    }

    // Parse JSON response
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
