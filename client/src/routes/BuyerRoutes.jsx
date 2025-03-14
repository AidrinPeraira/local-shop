import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { PageLoading } from "../components/ui/PageLoading";

const Home = lazy(() => import("../pages/BuyerPages/Home"));
const Login = lazy(() => import("../pages/BuyerPages/Login"));
const Register = lazy(() => import("../pages/BuyerPages/Register"));
const Shop = lazy(() => import("../pages/BuyerPages/Shop"));
const NotFound = lazy(() => import("../pages/BuyerPages/NotFound"));
const Product = lazy(() => import("../pages/BuyerPages/Product"));
const ForgotPassword = lazy(() => import("../pages/BuyerPages/ForgotPassword"));
const Profile = lazy(() => import("../pages/BuyerPages/Profile"));
const Cart = lazy(() => import("../pages/BuyerPages/Cart"));
const Checkout = lazy(() => import("../pages/BuyerPages/Checkout"));

const MainRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<PageLoading />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<PageLoading />}>
            <Register />
          </Suspense>
        }
      />
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoading />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/shop"
        element={
          <Suspense fallback={<PageLoading />}>
            <Shop />
          </Suspense>
        }
      />
      <Route
        path="/product/*"
        element={
          <Suspense fallback={<PageLoading />}>
            <Product />
          </Suspense>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<PageLoading />}>
            <ForgotPassword />
          </Suspense>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
      
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoading />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoading />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<PageLoading />}>
              <Checkout />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
