
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Navbar from "./context/components/Navbar";
import Home from "./pages/Home";
import Footer from "./context/components/Footer";
import Register from "./pages/Register";
import EnquiryForm from "./pages/EnquiryForm";
import TractorDetail from "./pages/TractorDetail";
import ArticleDetail from "./pages/ArticleDetail";
import ProductDetail from "./pages/ProductDetail";
import TractorListPage from "./pages/TractorListPage";
import ArticleListPage from "./pages/ArticleListPage";
import ProductListPage from "./pages/ProductListPage";
import MyProducts from "./pages/MyProducts";
import AddProductForm from "./pages/AddProductForm";
import EditProductForm from "./pages/EditProductForm";
import SubmitArticle from "./pages/SubmitArticle";
import AdminTractors from "./pages/AdminTractors";
import AdminProducts from "./pages/AdminProducts";
import AdminArticles from "./pages/AdminArticles";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminDashboard from "./pages/AdminDashboard";


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
          <Route path="/enquiry/new" element={<EnquiryForm />} />
          <Route path="/tractor/:id" element={<TractorDetail />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/tractors" element={<TractorListPage />} />
          <Route path="/articles" element={<ArticleListPage />} />
          <Route path="/products" element={<ProductListPage />} />

          <Route path="/my-products" element={
  <ProtectedRoute>
    <MyProducts />
  </ProtectedRoute>
} />
<Route path="/add-product" element={
  <ProtectedRoute>
    <AddProductForm />
  </ProtectedRoute>
} />
<Route path="/edit-product/:id" element={
  <ProtectedRoute>
    <EditProductForm />
  </ProtectedRoute>
} />
<Route path="/submit-article" element={
  <ProtectedRoute>
    <SubmitArticle />
  </ProtectedRoute>
} />
          {/* Example admin route – you can add later */}
          <Route path="/admin" element={
            <AdminRoute>
              <div className="p-8">Admin Panel – coming soon</div>
            </AdminRoute>
          } />
          <Route path="/admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
<Route path="/admin/enquiries" element={
  <AdminRoute>
    <AdminEnquiries />
  </AdminRoute>
} />
<Route path="/admin/articles" element={
  <AdminRoute>
    <AdminArticles />
  </AdminRoute>
} />
<Route path="/admin/products" element={
  <AdminRoute>
    <AdminProducts />
  </AdminRoute>
} />
<Route path="/admin/tractors" element={
  <AdminRoute>
    <AdminTractors />
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