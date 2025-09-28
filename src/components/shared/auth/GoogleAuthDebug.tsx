"use client";
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/state/authStore';

export const GoogleAuthDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { googleLogin } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addDebugInfo = (message: string) => {
    if (isClient) {
      setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'implicit', // Use implicit flow
    onSuccess: async (tokenResponse) => {
      try {
        addDebugInfo(`✅ Google access token received: ${tokenResponse.access_token.substring(0, 20)}...`);
        
        // Test the API call using local route
        addDebugInfo('🔄 Calling local API route...');
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
            redirect_uri: window.location.origin
          })
        });

        addDebugInfo(`📡 API Response Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          addDebugInfo(`✅ API Success: ${JSON.stringify(data).substring(0, 100)}...`);
          await googleLogin(tokenResponse.access_token);
          addDebugInfo('✅ Google login completed successfully!');
        } else {
          const errorData = await response.json();
          addDebugInfo(`❌ API Error: ${errorData.error || 'Unknown error'}`);
          addDebugInfo(`❌ Error Details: ${JSON.stringify(errorData)}`);
        }
      } catch (error) {
        addDebugInfo(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    onError: (error) => {
      addDebugInfo(`❌ Google OAuth Error: ${error}`);
    },
    // Add configuration for implicit flow
    scope: 'openid email profile',
  });

  const clearDebug = () => setDebugInfo([]);

  const testCORS = async () => {
    try {
      addDebugInfo('🔄 Testing CORS with local API...');
      const response = await fetch('/api/test-cors');
      const data = await response.json();
      addDebugInfo(`✅ Local CORS test: ${data.message}`);
      
      addDebugInfo('🔄 Testing CORS with local check-user API...');
      const backendResponse = await fetch('/api/auth/check-user', {
        method: 'GET',
        credentials: 'include',
      });
      addDebugInfo(`📡 Local API Status: ${backendResponse.status}`);
      
      if (backendResponse.ok) {
        addDebugInfo('✅ Local API test successful!');
      } else {
        const errorData = await backendResponse.json();
        addDebugInfo(`❌ Local API Error: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      addDebugInfo(`❌ CORS Test Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isClient) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Google Auth Debug</h3>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Google Auth Debug</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={() => handleGoogleLogin()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Google Login
        </button>
        <button
          onClick={testCORS}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        >
          Test CORS
        </button>
        <button
          onClick={clearDebug}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
        >
          Clear Debug
        </button>
      </div>

      <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
        {debugInfo.length === 0 ? (
          <div className="text-gray-500">Click "Test Google Login" to start debugging...</div>
        ) : (
          debugInfo.map((info, index) => (
            <div key={index} className="mb-1">{info}</div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Environment Variables:</strong></p>
        <p>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        <p>NEXT_PUBLIC_GOOGLE_CLIENT_ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Set' : 'Not Set'}</p>
        <p>Current Origin: {isClient ? window.location.origin : 'Loading...'}</p>
      </div>
    </div>
  );
};
