import React, { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { SellerLayout } from "../components/seller/SellerLayout";
import ProtectedRoute from "./ProtectedRoutes";
import { PageLoading } from "../components/ui/PageLoading";

const SellerRegister = lazy(() =>
  import("../pages/SellerPages/SellerRegister")
);
const SellerDashboard = lazy(() =>
  import("../pages/SellerPages/SellerDashboard")
);
const SellerProducts = lazy(() => import("../pages/SellerPages/Products"));
const SellerOrders = lazy(() => import("../pages/SellerPages/Orders"));
const SellerSettings = lazy(() => import("../pages/SellerPages/Settings"));
const SellerNotFound = lazy(() =>
  import("../pages/SellerPages/SellerNotFound")
);
const SellerAnalytics = lazy(() => import("../pages/SellerPages/Analytics"));
const SellerLogin = lazy(() => import("../pages/SellerPages/SellerLogin"));

const SellerRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<PageLoading />}>
            <SellerLogin />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<PageLoading />}>
            <SellerRegister />
          </Suspense>
        }
      />
      <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoading />}>
              <SellerLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoading />}>
                <SellerDashboard />
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<PageLoading />}>
                <SellerProducts />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<PageLoading />}>
                <SellerOrders />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<PageLoading />}>
                <SellerAnalytics />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoading />}>
                <SellerSettings />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoading />}>
                <SellerNotFound />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
