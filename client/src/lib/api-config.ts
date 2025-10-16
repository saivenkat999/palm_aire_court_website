// API configuration for different environments
export const API_CONFIG = {
  // Use environment variable or fallback to Railway URL
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
};

// Helper function to make API calls with proper base URL
export async function apiCall(endpoint: string, options?: RequestInit) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}
