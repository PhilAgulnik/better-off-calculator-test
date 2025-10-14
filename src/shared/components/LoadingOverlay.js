import React from 'react';

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Calculating...</p>
    </div>
  );
}

export default LoadingOverlay;
