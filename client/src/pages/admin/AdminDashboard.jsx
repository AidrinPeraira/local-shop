import React, { useEffect, useState } from "react";
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';


// Dummy components for subpages
import {Users} from './Users';  // User Details page
import {Products} from './Products';  // Products page (dummy)
import {Sales} from './Sales';  // Sales page (dummy)
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector(store => store.auth.user)
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
      dispatch(logout()) 
        .unwrap()
        .then(() => {
            navigate("/login");
          })
        .catch((err) => {
          console.error("Logout error:", err)
        });
    }
    
useEffect(() => {
  if (!user) {
    // Redirect to login and replace the history state
    navigate("/login", { replace: true });

    // Disable back button navigation to prevent access to the dashboard after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }
}, [user, navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Side Navigation (Drawer) */}
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItem button onClick={() => navigate("/admin/users")}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button onClick={() => navigate("/admin/products")}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button onClick={() => navigate("/admin/sales")}>
            <ListItemIcon><SellIcon /></ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Admin Navbar */}
        <AppBar position="sticky">
          <Toolbar>
            <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2 }}>
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Nested Routes for Admin */}
          <Routes>
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};
