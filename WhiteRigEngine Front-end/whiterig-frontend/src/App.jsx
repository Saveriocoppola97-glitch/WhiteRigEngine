import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/MyNavbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BackofficePage from "./pages/BackofficePage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ManageComponents from "./pages/ManageComponents";

function App() {
  return (
    <Router>
      <div className="bg-white min-vh-100">
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/backoffice/manage" element={<ManageComponents />} />
          <Route path="/backoffice/add" element={<BackofficePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
