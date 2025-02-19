import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { SellerLayout } from "../components/seller/SellerLayout";
import { SellerDashboard } from "../pages/Dashboards/seller/SellerDashboard";
import { SellerProducts } from "../pages/Dashboards/seller/Products";
import { SellerOrders } from "../pages/Dashboards/seller/Orders";
import { SellerSettings } from "../pages/Dashboards/seller/Settings";
import { SellerNotFound } from "../pages/Dashboards/seller/SellerNotFound";
import { SellerAnalytics } from "../pages/Dashboards/seller/Analytics";
import { SellerLogin } from "../pages/SellerLogin";

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