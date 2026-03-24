import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TractorList from "./pages/TractorList";
import ArticleList from "./pages/ArticleList";
import TractorDetail from "./pages/TractorDetail";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;