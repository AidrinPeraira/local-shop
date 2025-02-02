import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/user/Home";
import { Login } from "./pages/user/Login";
import { Register } from "./pages/user/Register";
import { Profile } from "./pages/user/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Users } from "./pages/admin/Users";
import { Box, Container } from "@mui/material";
import { Products } from "./pages/admin/Products";
import { Sales } from "./pages/admin/Sales";
import { PrivateRoute } from "./routes/PrivateRoute";
import { AdminRoute } from "./routes/AdminRoute";

function App() {
  return (
    <>
      <Container maxWidth="xl" >
        <Box>{/* Add Header HEre */}</Box>
        <Box>
          {/* This is where we have done the basic routing for the differnt pages */}
          <BrowserRouter>
            <Routes>
              <Route index path="/" element={<Navigate  to='/login' replace/>} />
              <Route index path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* we make the progile page and admin page viewable only if authorised in state  in store*/}
              <Route element={<PrivateRoute />}>
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route element={<PrivateRoute />}>
                <Route element={<AdminRoute />}>
                  <Route path="admin/*" element={<AdminDashboard />}>
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<Products />} />
                    <Route path="sales" element={<Sales />} />
                  </Route>
                </Route>
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
