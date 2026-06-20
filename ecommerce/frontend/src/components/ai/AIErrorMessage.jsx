import React from 'react';

const AIErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="error-dismiss"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AIErrorMessage;
