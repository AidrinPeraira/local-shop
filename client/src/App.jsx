import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/user/Home";
import { Login } from "./pages/user/Login";
import { Register } from "./pages/user/Register";
import { Profile } from "./pages/user/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Users } from "./pages/admin/Users";
import { Box, Container } from "@mui/material";
import { Products } from "./pages/admin/Products";
import { Sales } from "./pages/admin/Sales";

function App() {
  return (
    <>
      <Container maxWidth="xl" >
        <Box>{/* Add Header HEre */}</Box>
        <Box>
          {/* This is where we have done the basic routing for the differnt pages */}
          <BrowserRouter>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route index path="/home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />

              <Route path="admin/*" element={<AdminDashboard />}>
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="sales" element={<Sales />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Box>
        <Box>{/* Add Footer Here */}</Box>
      </Container>
    </>
  );
}

export default App;
