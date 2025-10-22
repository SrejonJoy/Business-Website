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

// Add axios interceptor to automatically send XSRF token for Sanctum CSRF protection
axios.interceptors.request.use((config) => {
  // Read XSRF-TOKEN cookie and send as X-XSRF-TOKEN header for state-changing requests
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    if (token) {
      // Decode the token (Laravel encodes it)
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// In development we rely on the CRA dev-server proxy (package.json "proxy") so API calls stay same-origin.
// Avoid forcing an absolute baseURL here so axios requests remain relative (e.g. '/api/...').
// Proactively request Sanctum CSRF cookie on app start so subsequent axios POSTs don't 419
axios.get('/sanctum/csrf-cookie')
  .then((res) => { console.debug('[csrf] fetched /sanctum/csrf-cookie', res && res.status); })
  .catch((err) => { console.warn('[csrf] failed to fetch /sanctum/csrf-cookie', err && err.message); });
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
