import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import AdminPage from './AdminPage';
import Header from './components/Header';

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/', '/login'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Redirect root path to the login page */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;