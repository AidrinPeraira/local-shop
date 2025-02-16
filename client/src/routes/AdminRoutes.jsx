import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AdminDashboard } from "../pages/Dashboards/admin/AdminDashboard";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Products } from "../pages/Dashboards/admin/Products";
import { Users } from "../pages/Dashboards/admin/Users";
import { Orders } from "../pages/Dashboards/admin/Orders";
import { Settings } from "../pages/Dashboards/admin/Settings";
import { AdminNotFound } from "../pages/Dashboards/admin/AdminNotFound";

export const AdminRoutes = () => {
  return (
    <Routes>
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
