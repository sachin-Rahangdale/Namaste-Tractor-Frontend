import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";



export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  // Check if user exists and role is ADMIN (case-insensitive)
  const isAdmin = user && (user.role === "ADMIN" || user.role === "admin");
  return isAdmin ? children : <Navigate to="/" />;
}