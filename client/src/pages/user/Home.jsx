import React from "react";
import { Container, Box, Typography, Button, Grid, Paper, AppBar, Toolbar, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Home = () => {
  // Dummy data for the homepage
  const items = [
    { id: 1, name: "Item 1", description: "This is a dummy item 1." },
    { id: 2, name: "Item 2", description: "This is a dummy item 2." },
    { id: 3, name: "Item 3", description: "This is a dummy item 3." },
    { id: 4, name: "Item 4", description: "This is a dummy item 4." },
  ];

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
              variant="outlined"
              color="white"
              component={Link}
              to="/login"
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
