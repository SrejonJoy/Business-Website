import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ToastContainer from './components/ToastContainer';
import ConfirmModal from './components/ConfirmModal';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.withCredentials = true;
// In development we rely on the CRA dev-server proxy (package.json "proxy") so API calls stay same-origin.
// Avoid forcing an absolute baseURL here so axios requests remain relative (e.g. '/api/...').
// Proactively request Sanctum CSRF cookie on app start so subsequent axios POSTs don't 419
axios.get('/sanctum/csrf-cookie')
  .then((res) => { console.debug('[csfr] fetched /sanctum/csrf-cookie', res && res.status); })
  .catch((err) => { console.warn('[csfr] failed to fetch /sanctum/csrf-cookie', err && err.message); });
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
