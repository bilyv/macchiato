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
      console.log('Testing API connection to:', `${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('Response text:', text);
      
      try {
        const json = JSON.parse(text);
        console.log('Response JSON:', json);
      } catch (e) {
        console.log('Response is not JSON');
      }
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
