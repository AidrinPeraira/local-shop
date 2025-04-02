import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { PageLoading } from "../components/ui/PageLoading";
import OrderDetails from "../pages/BuyerPages/OrderDetails.jsx";

const Home = lazy(() => import("../pages/BuyerPages/Home"));
const Login = lazy(() => import("../pages/BuyerPages/Login"));
const Register = lazy(() => import("../pages/BuyerPages/Register"));
const Shop = lazy(() => import("../pages/BuyerPages/Shop"));
const NotFound = lazy(() => import("../pages/BuyerPages/NotFound"));
const Product = lazy(() => import("../pages/BuyerPages/Product"));
const ForgotPassword = lazy(() => import("../pages/BuyerPages/ForgotPassword"));
const Profile = lazy(() => import("../pages/BuyerPages/Profile"));
const Checkout = lazy(() => import("../pages/BuyerPages/Checkout"));
const Cart = lazy(() => import("../pages/BuyerPages/Cart"));
const SavedList = lazy(() => import("../pages/BuyerPages/SavedList.jsx"));
const ProfileInfo = lazy(() => import("../components/profile/ProfileInfo"));
const ProfileOrders = lazy(() => import("../components/profile/ProfileOrders"));
const ProfileWallet = lazy(() => import("../components/profile/ProfileWallet"));
const ProfileAddress = lazy(() =>
  import("../components/profile/ProfileAddress")
);
const ProfilePassword = lazy(() =>
  import("../components/profile/ProfilePassword")
);

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
          path="/saved-list"
          element={
            <Suspense fallback={<PageLoading />}>
              <SavedList />
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
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Navigate to="/profile/info" replace />} />
          <Route path="info" element={<ProfileInfo />} />
          <Route path="wallet" element={<ProfileWallet />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="orders/:id" element={
            <Suspense fallback={<PageLoading />}>
              <OrderDetails />
            </Suspense>
          } />
          <Route path="addresses" element={<ProfileAddress />} />
          <Route path="security" element={<ProfilePassword />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
