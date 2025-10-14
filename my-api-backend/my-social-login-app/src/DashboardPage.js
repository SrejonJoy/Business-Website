import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WelcomeModal from './components/WelcomeModal';
import CookieConsent from './components/CookieConsent';

axios.defaults.withCredentials = true;

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user when the component loads
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (error) {
        console.error('Not authenticated', error);
        navigate('/login'); // Redirect to login if not authenticated
      }
    };
    fetchUser();
  }, [navigate]);

  // Welcome modal state: show only if no welcome cookie
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    try {
      const match = document.cookie.match(new RegExp('(^| )welcome_shown=([^;]+)'));
      if (!match) {
        setShowWelcome(true);
      }
    } catch (e) {
      // ignore
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    document.cookie = 'welcome_shown=1; path=/; max-age=' + 60 * 60 * 24 * 365;
    setShowWelcome(false);
  };

  const handleCookieAccept = async () => {
    try {
      // Initialize CSRF cookie for Laravel Sanctum after consent
      await axios.get('/sanctum/csrf-cookie');
    } catch (e) {
      console.warn('Failed to fetch CSRF cookie after accepting cookies', e);
    }
  };

  const handleLogout = async () => {
    try {
      // Ensure CSRF cookie/token is present for the POST
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {showWelcome && <WelcomeModal onClose={closeWelcome} />}
  <CookieConsent onAccept={handleCookieAccept} />
      <h1>Welcome, {user.name}</h1>
      <p>You are logged in.</p>
      <p>Your email is: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;