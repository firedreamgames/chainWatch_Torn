import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ closeModal, handleLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const submitApiKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    handleLogin(apiKey);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Please enter your public API key</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <input 
          type="text" 
          value={apiKey} 
          onChange={(e) => {
            setApiKey(e.target.value);
            setError(''); // Clear error when user starts typing
          }} 
          placeholder="API Key" 
        />
        <button className="submit-btn" onClick={submitApiKey}>Submit</button>
      </div>
    </div>
  );
};

export default Modal;

