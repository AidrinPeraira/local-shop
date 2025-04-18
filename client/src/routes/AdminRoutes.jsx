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
const AdminOrdersPage = LazyComponent(lazy(() => import("../pages/AdminPages/AdminOrdersPage")));
const AdminNotFound = LazyComponent(lazy(() => import("../pages/AdminPages/AdminNotFound")));
const AdminCoupons = LazyComponent(lazy(() => import("../pages/AdminPages/AdminCoupons")));
const AdminTransactions = LazyComponent(lazy(() => import("../pages/AdminPages/AdminTransactions")));
const AdminPayouts = LazyComponent(lazy(() => import("../pages/AdminPages/AdminPayouts")));
const AdminWallets = LazyComponent(lazy(() => import("../pages/AdminPages/AdminWallets")));
const AdminReturns = LazyComponent(lazy(() => import("../pages/AdminPages/AdminReturns")));
const AdminSales = LazyComponent(lazy(() => import("../pages/AdminPages/AdminSales")));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="returns" element={<AdminReturns />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="user-wallets" element={<AdminWallets />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
