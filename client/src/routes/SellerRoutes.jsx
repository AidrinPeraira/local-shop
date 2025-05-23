import  { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SellerLayout } from "../components/seller/SellerLayout";
import ProtectedRoute from "./ProtectedRoutes";
import { PageLoading } from "../components/ui/PageLoading";

// Lazy load components
const LazyComponent = (Component) => (props) => (
  <Suspense fallback={<PageLoading />}>
    <Component {...props} />
  </Suspense>
);

// Lazy load all pages
const SellerLogin = LazyComponent(lazy(() => import("../pages/SellerPages/SellerLogin")));
const SellerRegister = LazyComponent(lazy(() => import("../pages/SellerPages/SellerRegister")));
const SellerDashboard = LazyComponent(lazy(() => import("../pages/SellerPages/SellerDashboard")));
const SellerProducts = LazyComponent(lazy(() => import("../pages/SellerPages/SellerProducts")));
const SellerOrders = LazyComponent(lazy(() => import("../pages/SellerPages/SellerOrders")));
const SellerReturns = LazyComponent(lazy(() => import("../pages/SellerPages/SellerReturns")));
const SellerTransactions = LazyComponent(lazy(() => import("../pages/SellerPages/SellerTransactions")));
const SellerNotFound = LazyComponent(lazy(() => import("../pages/SellerPages/SellerNotFound")));
const SellerSales = LazyComponent(lazy(() => import("../pages/SellerPages/SellerSales")));

const SellerRoutes = () => {
  return (

    
    <Routes>
      <Route path="/login" element={<SellerLogin />} />
      <Route path="/register" element={<SellerRegister />} />
      <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route path="/" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="sales" element={<SellerSales />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="returns" element={<SellerReturns />} />
          <Route path="transactions" element={<SellerTransactions />} />
          <Route path="*" element={<SellerNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
