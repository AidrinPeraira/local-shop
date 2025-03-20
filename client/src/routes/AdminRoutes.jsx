import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import ProtectedRoute from "./ProtectedRoutes";
import { PageLoading } from "../components/ui/PageLoading";

// Lazy load components. This is easy way to wrap all components in a single go
const LazyComponent = (Component) => (props) => (
  <Suspense fallback={<PageLoading />}>
    <Component {...props} />
  </Suspense>
);

// Lazy load all pages
const AdminLogin = LazyComponent(lazy(() => import("../pages/AdminPages/AdminLogin")));
const AdminDashboard = LazyComponent(lazy(() => import("../pages/AdminPages/AdminDashboard")));
const AdminUsers = LazyComponent(lazy(() => import("../pages/AdminPages/AdminUsers")));
const AdminSellers = LazyComponent(lazy(() => import("../pages/AdminPages/AdminSellers")));
const AdminProductsPage = LazyComponent(lazy(() => import("../pages/AdminPages/AdminProductsPage")));
const Categories = LazyComponent(lazy(() => import("../pages/AdminPages/AdminCategories")));
const AdminNotFound = LazyComponent(lazy(() => import("../pages/AdminPages/AdminNotFound")));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
