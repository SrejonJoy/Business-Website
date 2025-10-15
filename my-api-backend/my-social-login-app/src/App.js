import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import AdminLayout from './admin/AdminLayout';
import AdminRoles from './admin/AdminRoles';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminJersey from './admin/AdminJersey';
import AdminJerseyEdit from './admin/AdminJerseyEdit';
import AdminJerseyRemove from './admin/AdminJerseyRemove';
import AdminJerseyDiscount from './admin/AdminJerseyDiscount';
import Header from './components/Header';
import Footer from './components/Footer';

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/', '/login'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  const hideFooterPaths = ['/', '/login'];
  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminRoles />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="jersey" element={<AdminJersey />} />
          <Route path="jersey/edit" element={<AdminJerseyEdit />} />
          <Route path="jersey/remove" element={<AdminJerseyRemove />} />
          <Route path="jersey/discount" element={<AdminJerseyDiscount />} />
        </Route>
        {/* Redirect root path to the login page */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
      {showFooter && <Footer />}
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