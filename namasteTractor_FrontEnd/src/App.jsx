import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TractorList from "./pages/TractorList";
import ArticleList from "./pages/ArticleList";
import TractorDetail from "./pages/TractorDetail";
import ArticleDetail from "./pages/ArticleDetail";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";
import CreateArticle from "./components/admin/CreateArticle";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tractors" element={<TractorList />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/tractors/:id" element={<TractorDetail />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/create-article" element={<CreateArticle />} />
        <Route
           path="/admin"
           element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                   }
        />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;