import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Importiamo il CartProvider
import MyNavbar from "./components/MyNavbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BackofficePage from "./pages/BackofficePage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ManageComponents from "./pages/ManageComponents";
import CartPage from "./pages/CartPage";
import MePage from "./pages/MePage";
import UserOrdersPage from "./pages/UserOrdersPage";
import BuildPage from "./pages/BuildPage";

function App() {
  return (
    <CartProvider>
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/me" element={<MePage />} />
            <Route path="/my-orders" element={<UserOrdersPage />} />
            <Route path="/build" element={<BuildPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
