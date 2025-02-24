import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AdminDashboard } from "../pages/AdminPages/AdminDashboard";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Products } from "../pages/AdminPages/Products";
import { Users } from "../pages/AdminPages/Users";
import { AdminNotFound } from "../pages/AdminPages/AdminNotFound";
import AdminLogin from "../pages/AdminPages/AdminLogin";
import ProtectedRoute from "./ProtectedRoutes";
import Categories from "../pages/AdminPages/Categories";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
