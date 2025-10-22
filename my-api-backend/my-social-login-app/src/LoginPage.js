import React from 'react';
import axios from 'axios';

// Configure axios to send credentials (cookies) with every request
axios.defaults.withCredentials = true;

const LoginPage = () => {
  // Direct link to the backend for social login
  const googleLogin = () => {
    // Use API base URL if provided (production), fallback to relative in dev
    const base = (process.env.REACT_APP_API_BASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
    const url = base ? `${base}/auth/google/redirect` : '/auth/google/redirect';
    window.location.href = url;
  };

  // Function to handle guest login via an API call
  const handleGuestLogin = async () => {
    try {
      // Ensure Sanctum CSRF cookie is set first (only needed for session-based auth)
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/api/auth/guest');
      // On success, navigate to the dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Guest login failed', error);
    }
  };

  return (
    <div>
      <h1>Login to Your Account</h1>
      <button onClick={googleLogin}>Login with Google</button>
      <br /><br />
  {/* Facebook login removed */}
      <button onClick={handleGuestLogin}>Continue as Guest</button>
    </div>
  );
};

export default LoginPage;