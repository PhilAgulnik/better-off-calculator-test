import React, { useState } from 'react';
import './PasswordProtection.css';

function PasswordProtection({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const CORRECT_PASSWORD = '3ntitledto';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('authenticated', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="password-protection">
      <div className="password-box">
        <h1>Universal Credit Calculator</h1>
        <p>Please enter the password to access the calculator</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className={error ? 'error' : ''}
            autoFocus
          />
          {error && <p className="error-message">Incorrect password. Please try again.</p>}
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordProtection;
