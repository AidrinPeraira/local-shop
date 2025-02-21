import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AdminDashboard } from "../pages/AdminPages/AdminDashboard";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Products } from "../pages/AdminPages/Products";
import { Users } from "../pages/AdminPages/Users";
import { Orders } from "../pages/AdminPages/Orders";
import { Settings } from "../pages/AdminPages/Settings";
import { AdminNotFound } from "../pages/AdminPages/AdminNotFound";
import AdminLogin from "../pages/AdminPages/AdminLogin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<AdminNotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
