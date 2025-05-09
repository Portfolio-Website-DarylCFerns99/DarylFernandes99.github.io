import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/admin/LoginPage';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route component to check for authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<div>Home Page - Coming Soon</div>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
              <p>Dashboard content will be implemented in future updates.</p>
            </div>
          </ProtectedRoute>
        } />
        
        {/* 404 Page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
