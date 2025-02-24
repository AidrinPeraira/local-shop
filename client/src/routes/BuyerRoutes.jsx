import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/BuyerPages/Home";
import { Login } from "../pages/BuyerPages/Login";
import { Register } from "../pages/BuyerPages/Register";
import { Shop } from "../pages/BuyerPages/Shop";
import { NotFound } from "../pages/BuyerPages/NotFound";
import { SavedList } from "../pages/BuyerPages/SavedList";
import { Cart } from "../pages/BuyerPages/Cart";
import { Product } from "../pages/BuyerPages/Product";
import ProtectedRoute from "./ProtectedRoutes";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product" element={<Product />} />

      <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
        <Route path="/saved" element={<SavedList />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
