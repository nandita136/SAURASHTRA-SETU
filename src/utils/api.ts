import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-dc1b1882`;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const token = localStorage.getItem('auth_token') || publicAnonKey;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Handle network errors
    if (!response.ok) {
      let errorMessage = 'API request failed';
      let errorData;
      
      try {
        errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      console.error('API Error:', {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        data: errorData
      });
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    // Handle fetch errors (network issues, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your internet connection.');
    }
    
    // Re-throw other errors
    throw error;
  }
}