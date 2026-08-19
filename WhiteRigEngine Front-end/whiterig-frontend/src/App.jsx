import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/MyNavbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BackofficePage from "./pages/BackofficePage";

function App() {
  return (
    <Router>
      <div className="bg-white min-vh-100">
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/backoffice" element={<BackofficePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
