import axios from 'axios';
import { User } from '@/types';

// Use Next.js rewrites to avoid CORS: keep baseURL relative
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Create a separate API instance for Google Auth that bypasses CORS
export const googleApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Unauthorized user")
//       window.location.href = '/';
//     }
//     return Promise.reject(error);
//   }
// );

export const authAPI = {
  signIn: async (email: string, password: string) => {
    // Use the local API route to bypass CORS
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Sign-in failed');
    }

    const data = await response.json();
    return { data };
  },

  signUp: async (name: string, email: string, password: string) => {
    console.log("Sending sign-up payload for user:", email);
    // Use the local API route to bypass CORS
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Sign-up failed');
    }

    const data = await response.json();
    return { data };
  },

  googleAuth: async (authCodeOrToken: string) => {
    // Use the local API route to bypass CORS
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        access_token: authCodeOrToken, // Send as access token for implicit flow
        redirect_uri: window.location.origin
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Google authentication failed');
    }

    const data = await response.json();
    return { data };
  },

  logout: async () => {
    // Use the local API route to bypass CORS
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Logout failed');
    }

    const data = await response.json();
    return { data };
  },

  checkUser: async (): Promise<User> => {
    // Use the local API route to bypass CORS
    const response = await fetch('/api/auth/check-user', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('User check failed');
    }

    const data = await response.json();
    return data;
  },
};

export const dataAPI = {
  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      
      // Direct backend call (CSR)
      const response = await fetch(`${API_BASE_URL}/v1/api/data/upload-file`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.error || `Upload failed with status ${response.status}`;
        } catch (parseError) {
          // If response is not JSON, handle specific status codes
          if (response.status === 413) {
            errorMessage = 'File too large. Please select a smaller file (max 50MB).';
          } else if (response.status === 401) {
            errorMessage = 'Authentication required. Please sign in again.';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            // Try to get response text for better error info
            try {
              const responseText = await response.text();
              errorMessage = `Upload failed (${response.status}): ${responseText.substring(0, 100)}`;
            } catch {
              errorMessage = `Upload failed with status ${response.status}`;
            }
          }
        }
        console.error('Upload error details:', { status: response.status, errorMessage });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Normalize response shape
      if (data?.success && Array.isArray(data.results) && data.results[0]) {
        return {
          success: true,
          uploadId: data.results[0].uploadId,
          originalFileName: data.results[0].originalFileName,
        } as const;
      }
      return { success: false } as const;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },

  getUploadStatus: async (upload_id: string, extension: string) => {
    try {
      // Direct backend call (CSR)
      const response = await fetch(
        `${API_BASE_URL}/v1/api/data/upload-status?upload_id=${upload_id}&extension=${extension}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Status check failed' }));
        throw new Error(errorData.detail || errorData.error || 'Status check failed');
      }

      const data = await response.json();
      
      // Possible shapes:
      // { success: true, message: { progress, status } }
      // { success: true, message: 'Job not found.' }
      // { progress, status }
      if (data?.success === true) {
        if (typeof data.message === 'string') {
          return { success: true, notFound: data.message.includes('Job not found.') } as const;
        }
        return {
          success: true,
          progress: Number(data.message?.progress ?? 0),
          status: String(data.message?.status ?? ''),
        } as const;
      }
      if (typeof data === 'object' && (data.progress !== undefined || data.status !== undefined)) {
        return {
          success: true,
          progress: Number(data.progress ?? 0),
          status: String(data.status ?? ''),
        } as const;
      }
      return { success: false } as const;
    } catch (error) {
      console.error('Upload status API error:', error);
      throw error;
    }
  },

  deleteFile: async (uploadId: string) => {
    try {
      // Direct backend call (CSR)
      const response = await fetch(`${API_BASE_URL}/v1/api/data/upload-remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ uploadId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Delete failed' }));
        throw new Error(errorData.detail || errorData.error || 'Delete failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  },
};

export const chatAPI = {
  query: async (userQuery: string, attachedFiles?: any[], chatId?: string) => {
    try {
      // Direct backend call (CSR)
      const response = await fetch(`${API_BASE_URL}/v1/api/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userQuery, 
          attachedFiles: attachedFiles || [], 
          chatId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Chat query failed' }));
        throw new Error(errorData.detail || errorData.error || 'Chat query failed');
      }

      const data = await response.json();
      console.log('Chat API response:', data);
      
      // Handle different response structures
      if (data.data) {
        return data.data;
      }
      return data;

    } catch (error: unknown) {
      console.error("Chat query failed:", error);
      return { "type" : "error", "message": "Something went wrong. Please try again."};
    }
  },
};