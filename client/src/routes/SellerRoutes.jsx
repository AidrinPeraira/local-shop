import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { SellerLayout } from "../components/seller/SellerLayout";
import { SellerDashboard } from "../pages/SellerPages/SellerDashboard";
import { SellerProducts } from "../pages/SellerPages/Products";
import { SellerOrders } from "../pages/SellerPages/Orders";
import { SellerSettings } from "../pages/SellerPages/Settings";
import { SellerNotFound } from "../pages/SellerPages/SellerNotFound";
import { SellerAnalytics } from "../pages/SellerPages/Analytics";
import { SellerLogin } from "../pages/SellerPages/SellerLogin"
import { SellerRegister } from "../pages/SellerPages/SellerRegister";

const SellerRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<SellerLogin/>}/>
        <Route path="/register" element={<SellerRegister/>}/>
        <Route path="/" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="settings" element={<SellerSettings />} />
          <Route path="*" element={<SellerNotFound />} />
        </Route>
      </Routes>
  );
};

export default SellerRoutes