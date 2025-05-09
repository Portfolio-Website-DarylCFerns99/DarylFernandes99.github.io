import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy-loaded admin components
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

// Admin routes configuration
export const ADMIN_ROUTES = [
  {
    path: '/admin',
    component: LoginPage,
    protected: false
  },
  {
    path: '/admin/dashboard',
    component: () => (
      <ProtectedRoute>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p>Dashboard content will be implemented in future updates.</p>
        </div>
      </ProtectedRoute>
    ),
    protected: true
  }
];
