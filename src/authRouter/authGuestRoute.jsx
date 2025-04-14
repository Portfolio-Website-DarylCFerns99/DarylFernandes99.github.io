import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext.jsx";

// Protected Route (Requires Authentication)
export const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

// Guest Route (Accessible Only to Unauthenticated Users)
export const GuestRoute = () => {
  const { user } = useAuth();
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};
