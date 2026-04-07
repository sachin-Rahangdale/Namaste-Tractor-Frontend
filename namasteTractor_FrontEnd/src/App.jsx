
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Navbar from "./context/components/Navbar";
import Home from "./pages/Home";
import Footer from "./context/components/Footer";
import Register from "./pages/Register";


// Protected route wrapper (same as before)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-10">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Optional: Admin route wrapper (if needed)
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-10">Loading...</div>;
  return user && user.role === "ADMIN" ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          {/* Example admin route – you can add later */}
          <Route path="/admin" element={
            <AdminRoute>
              <div className="p-8">Admin Panel – coming soon</div>
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;