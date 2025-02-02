import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../../redux/slices/authSlice";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // To handle backend errors


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    //BASIC FORM VALIDATION TEMPLATE
    if (!username) {
      validationErrors.username = "Username is required";
    }
    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Please enter a valid email";
    }

    // Validate password
    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(validationErrors).length === 0) {
    
        dispatch(register({username, email, password }))
        .unwrap()
        .then((response) => {
          if (response.data.role == 'admin') {
            navigate("/admin/users");
          } else if (response.data.role == 'user-buyer'){
            navigate('/home')
          } else {
            navigate('/login')
          }
        })
        .catch((err) => {
          console.error("Login error:", err || "An error occurred. Please try again.")
          setErrorMessage(err || "An error occurred. Please try again.")
        });
        
      

        

    } else {
      setErrors(validationErrors);
    }
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
        <Typography variant="h4" gutterBottom>
          Create an Account on LocalShop 
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!errors.password}
            helperText={errors.password}
          />
          
          {/* Show any error message from the backend */}
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};