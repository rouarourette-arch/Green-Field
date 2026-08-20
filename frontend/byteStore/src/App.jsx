import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { RoleProtectedRoute } from './components/RoleProtectedRoute.jsx';

import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Profile } from './pages/Profile.jsx';

const ClientDashboard = () => <h2>Client Dashboard - ByteStore</h2>;
const SellerDashboard = () => <h2>Seller Dashboard - ByteStore</h2>;
const AdminDashboard = () => <h2>Admin Dashboard - ByteStore</h2>;

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div style={{ padding: '2rem' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Role-Based Dashboard Routes */}
            <Route
              path="/client/*"
              element={
                <RoleProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/seller/*"
              element={
                <RoleProtectedRoute allowedRoles={['seller']}>
                  <SellerDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;