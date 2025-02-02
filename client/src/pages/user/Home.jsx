import React, { useEffect } from "react";
import { Container, Box, Typography, Button, Grid, Paper, AppBar, Toolbar, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Cookies from 'js-cookie';
import { store } from "../../redux/store";

export const Home = () => {
  // Dummy data for the homepage
  const items = [
    { id: 1, name: "Item 1", description: "This is a dummy item 1." },
    { id: 2, name: "Item 2", description: "This is a dummy item 2." },
    { id: 3, name: "Item 3", description: "This is a dummy item 3." },
    { id: 4, name: "Item 4", description: "This is a dummy item 4." },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout()) 
      .unwrap()
      .then(() => {
        console.log('outing')
          navigate("/login");
        })
      .catch((err) => {
        console.error("Logout error:", err)
      });
  }

  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      navigate("/login", { replace: true }); // Replace history to prevent going back
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
      }
    
    }
      
  }, [user, navigate]);


  return (
    <Container maxWidth="md">
      {/* Navbar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LocalShop
          </Typography>

          {/* Profile & Logout Actions */}
          <Box>
            <IconButton
              color="inherit"
              component={Link}
              to="/profile"
              sx={{ mr: 2 }}
            >
              <AccountCircleIcon />
            </IconButton>
            <Button
              onClick={handleLogout}
              variant="outlined"
              color="white"
              component={Link}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to LocalShop
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Find the best items for your needs.
        </Typography>

        {/* Dummy Data Display */}
        <Grid container spacing={3} justifyContent="center">
          {items.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={3}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
