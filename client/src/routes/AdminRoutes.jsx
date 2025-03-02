import React, { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import ProtectedRoute from "./ProtectedRoutes";
import { PageLoading } from "../components/ui/PageLoading";

const AdminLogin = lazy(() => import("../pages/AdminPages/AdminLogin"));
const AdminDashboard = lazy(() => import("..pages/AdminPages/AdminDashboard"));
const Products = lazy(() => import("..pages/AdminPages/Products"));
const Users = lazy(() => import("..pages/AdminPages/Users"));
const AdminNotFound = lazy(() => import("..pages/AdminPages/AdminNotFound"));
const Categories = lazy(() => import("..pages/AdminPages/Categories"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Suspense fallback={<PageLoading />}>
        <Route path="login" element={<AdminLogin />} />
      </Suspense>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoading />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoading />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<PageLoading />}>
                <Products />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<PageLoading />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="categories"
            element={
              <Suspense fallback={<PageLoading />}>
                <Categories />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoading />}>
                <AdminNotFound />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
