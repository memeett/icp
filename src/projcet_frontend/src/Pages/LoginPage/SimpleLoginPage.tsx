import React, { useState } from 'react';
import { loginWithInternetIdentity } from '../../controller/userController';

const SimpleLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const success = await loginWithInternetIdentity();
      if (success) {
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: 'white',
          fontSize: '18px'
        }}>
          Connecting to Internet Identity...
        </div>
      )}
      
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '10px'
        }}>
          Welcome to ERGASIA
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Sign in with Internet Identity
        </p>
        
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: loading ? '#9ca3af' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          🌐 {loading ? 'Connecting...' : 'Continue with Internet Identity'}
        </button>
        
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '20px'
        }}>
          New user? After signing in, you'll complete your profile setup.
        </p>
      </div>
    </div>
  );
};

export default SimpleLoginPage;
