import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout, profileUpdate } from "../../redux/slices/authSlice";
import axios from "axios";
import { store } from "../../redux/store";


export const Profile = () => {
  // Sample user data
  const user = useSelector(state => state.auth.user)
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture: user.imgUrl,
  });

  const [openModal, setOpenModal] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [newPassword, setNewPassword] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    // If no user, redirect to login
    if (!user) {
      navigate("/login", { replace: true }); // Replace history to prevent going back
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
      }
    
    }
      
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!newUsername) validationErrors.username = "Username is required";
    if (!newEmail) validationErrors.email = "Email is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail)) validationErrors.email = "Invalid email address";

    if (Object.keys(validationErrors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("_id", user._id)
        console.log(user._id)
        formData.append("username", newUsername);
        formData.append("email", newEmail);
        
        if (newPassword && newPassword !== "") {
          formData.append("password", newPassword);
        }
        
        if (newProfilePicture && newProfilePicture !== '') {
          formData.append("imgUrl", user.imgUrl);
        }
        
        
  
  

        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }
  
        const response = await axios.put("http://localhost:3000/api/users/profile", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });


        // Edit auth slice in store with new data
        const updatedUser = {
          _id: response.data._id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          imgUrl: response.data.imgUrl,
        }
        
        dispatch(profileUpdate(updatedUser))

        // Optionally update the redux store if needed
        // dispatch(updateUser(response.data));

        handleCloseModal();
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const updatedUser = state.auth.user;
      
      if (updatedUser) {
        setUserData({
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          profilePicture: updatedUser.imgUrl,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);


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
