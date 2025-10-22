import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ToastContainer from './components/ToastContainer';
import ConfirmModal from './components/ConfirmModal';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.withCredentials = true;
// Use API base URL from env in production (Vercel). In dev, CRA proxy handles relative '/api' URLs.
if (process.env.REACT_APP_API_BASE_URL) {
  // Be defensive: trim and strip accidental quotes from the value set in Vercel
  const raw = process.env.REACT_APP_API_BASE_URL;
  const cleaned = raw.trim().replace(/^['"]|['"]$/g, '');
  try {
    // Validate URL to avoid "Failed to construct 'URL'" errors when axios builds the request
    // eslint-disable-next-line no-new
    new URL(cleaned);
    axios.defaults.baseURL = cleaned;
    // Help debug in production by logging once (harmless)
    console.info('[env] API base URL set to', axios.defaults.baseURL);
  } catch (e) {
    console.warn('[env] Invalid REACT_APP_API_BASE_URL value:', raw);
  }
} else {
  console.info('[env] REACT_APP_API_BASE_URL not set; using relative URLs');
}

// Add axios interceptor to send Bearer token if available (for cross-domain authentication)
axios.interceptors.request.use((config) => {
  // Check if there's an auth token in localStorage
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.debug('[auth] Sending Bearer token with', config.method?.toUpperCase(), config.url);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  <ConfirmModal />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
