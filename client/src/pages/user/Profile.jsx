import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Modal,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export const Profile = () => {
  // Sample user data
  const [userData, setUserData] = useState({
    username: "JohnDoe",
    email: "john@example.com",
    role: "User",
    profilePicture: "/static/images/avatar/1.jpg",
  });

  const [openModal, setOpenModal] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [newPassword, setNewPassword] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [errors, setErrors] = useState({});

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleProfileImageChange = (e) => {
    setNewProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const resetForm = () => {
    setNewUsername(userData.username);
    setNewEmail(userData.email);
    setNewPassword("");
    setNewProfilePicture(null);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!newUsername) validationErrors.username = "Username is required";
    if (!newEmail) validationErrors.email = "Email is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail)) validationErrors.email = "Invalid email address";
    if (!newPassword) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length === 0) {
      // Update user data (API call or state update)
      setUserData({
        username: newUsername,
        email: newEmail,
        role: userData.role,
        profilePicture: newProfilePicture || userData.profilePicture,
      });
      handleCloseModal();
    } else {
      setErrors(validationErrors);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear user session or authentication data
    // You might want to clear tokens, localStorage/sessionStorage, or redirect to the login page
    console.log("Logging out...");
    // Example: clear localStorage, redirect to login
    localStorage.removeItem("authToken");
    window.location.href = "/login";  // Redirect to login page
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Avatar
          alt="Profile Picture"
          src={userData.profilePicture}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h5" gutterBottom>
          {userData.username}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {userData.email}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Role: {userData.role}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          startIcon={<EditIcon />}
          sx={{ mb: 2 }}
        >
          Edit Profile
        </Button>

        {/* Logout Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          sx={{ mb: 2 }}
        >
          Logout
        </Button>

        {/* Edit Profile Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: 3,
              borderRadius: 2,
              width: 400,
            }}
          >
            <Typography variant="h6" mb={2}>
              Edit Profile
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                error={!!errors.password}
                helperText={errors.password}
              />
              <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={8}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    Upload Profile Picture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  {newProfilePicture && (
                    <Avatar
                      alt="New Profile Picture"
                      src={newProfilePicture}
                      sx={{ width: 50, height: 50 }}
                    />
                  )}
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Save Changes
              </Button>
            </form>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};
