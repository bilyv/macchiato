import React from 'react';
import { API_BASE_URL } from '../lib/api/core';

export const ApiDebugInfo: React.FC = () => {
  const envInfo = {
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    API_BASE_URL,
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD,
    dev: import.meta.env.DEV,
    allViteVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  };

  const testApiConnection = async () => {
    try {
      // Test health endpoint (which is at root level, not under /api)
      const healthUrl = import.meta.env.VITE_BACKEND_URL
        ? `${import.meta.env.VITE_BACKEND_URL}/health`
        : '/health';

      console.log('Testing health endpoint:', healthUrl);
      const healthResponse = await fetch(healthUrl);
      console.log('Health response status:', healthResponse.status);
      const healthText = await healthResponse.text();
      console.log('Health response:', healthText);

      // Test API endpoint
      console.log('Testing API endpoint:', `${API_BASE_URL}/rooms`);
      const apiResponse = await fetch(`${API_BASE_URL}/rooms`);
      console.log('API response status:', apiResponse.status);
      const apiText = await apiResponse.text();
      console.log('API response:', apiText);

    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h4>🔧 API Debug Info</h4>
      <pre>{JSON.stringify(envInfo, null, 2)}</pre>
      <button
        onClick={testApiConnection}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Test API Connection
      </button>
    </div>
  );
};
