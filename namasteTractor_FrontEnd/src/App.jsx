import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TractorList from "./pages/TractorList";
import ArticleList from "./pages/ArticleList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/tractors" element={<TractorList />} />
        <Route path="/articles" element={<ArticleList/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;