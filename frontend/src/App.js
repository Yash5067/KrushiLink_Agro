import Login from './component/login';
import Register from './component/register';
import Home from './component/home';
import Addproduct from './component/Addproduct';
import ViewProducts from './component/ViewProduct';
import Products from './component/Product';
import Dashboard from './component/Dashboard';
import EditProduct from './component/EditProduct';
import BulkUpload from './component/BulkUpload';
import NearestShops from './component/NearestShops';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const DashboardGuard = () => {
  const role = (sessionStorage.getItem("role") || "").toLowerCase();
  
  // If the user is a farmer, redirect them away from the dashboard
  if (role === "farmer") {
    return <Navigate to="/products" replace />;
  }
  // Otherwise, allow access to the dashboard for shop owners
  return <Dashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-product" element={<Addproduct />} />
        <Route path="/view-products" element={<ViewProducts />} />
        <Route path="/products" element={<Products />} />

        <Route path="/dashboard" element={<DashboardGuard />} />
        <Route path="/Dashboard" element={<DashboardGuard />} />

        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
        <Route path="/nearest-shops" element={<NearestShops />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;