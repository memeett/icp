import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

interface FaceRecognitionProps {
  principalId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  mode: 'register' | 'verify';
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({
  principalId,
  onSuccess,
  onError,
  mode: initialMode
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentMode, setCurrentMode] = useState(initialMode);

  const capture = async () => {
    if (!webcamRef.current) return;
  
    try {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }
  
      // Perbaikan cara convert base64 ke blob
      const base64Data = imageSrc.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
  
      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg'); // Tambahkan nama file
      formData.append('principal_id', principalId);
  
      // Tambahkan headers yang sesuai
      const endpoint = currentMode === 'register' ? '/register-face' : '/verify-face';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Jangan set Content-Type karena FormData akan mengaturnya sendiri
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Response from server:', result);
  
      if (result.status === 'success') {
        console.log(result.message);
        onSuccess();
      } else {
        onError(result.message || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error in capture:', error);
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsCapturing(false);
    }
  };
  

  return (
    <div className="face-recognition">
      <div className="mode-selector" style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setCurrentMode('register')}
          style={{
            backgroundColor: currentMode === 'register' ? '#4CAF50' : '#f0f0f0',
            marginRight: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Registration Mode
        </button>
        <button 
          onClick={() => setCurrentMode('verify')}
          style={{
            backgroundColor: currentMode === 'verify' ? '#2196F3' : '#f0f0f0',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Verification Mode
        </button>
      </div>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={true}
        className="webcam"
        style={{
          width: '100%',
          maxWidth: '640px',
          marginBottom: '1rem'
        }}
      />
      
      <button 
        onClick={capture}
        disabled={isCapturing}
        style={{
          backgroundColor: '#ff4081',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '4px',
          cursor: isCapturing ? 'not-allowed' : 'pointer',
          opacity: isCapturing ? 0.7 : 1
        }}
      >
        {isCapturing ? 'Processing...' : currentMode === 'register' ? 'Register Face' : 'Verify Face'}
      </button>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Current Mode: {currentMode === 'register' ? 'Registration' : 'Verification'}
      </div>
    </div>
  );
};

export default FaceRecognition;
