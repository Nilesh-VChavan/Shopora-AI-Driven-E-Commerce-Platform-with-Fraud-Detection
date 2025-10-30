import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { getRole } from "./utils/auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  const Protected = ({ children, admin }) => {
    if (!getRole()) return <Navigate to="/login" />;
    if (admin && getRole() !== "admin") return <Navigate to="/products" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Navbar role={role} setRole={setRole} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Protected><Products /></Protected>} />
        <Route path="/product/:id" element={<Protected><ProductDetail /></Protected>} />
        <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
        <Route path="/cart" element={<Protected><Cart /></Protected>} />
        <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
        <Route path="/order-success/:id" element={<Protected><OrderSuccess /></Protected>} />
        <Route path="/orders" element={<Protected><Orders /></Protected>} />
        <Route path="/admin/orders" element={<><Navbar /><AdminOrders /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;