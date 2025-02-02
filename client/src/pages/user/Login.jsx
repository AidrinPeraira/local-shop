import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import {login} from '../../redux/slices/authSlice'

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector(state => state.auth)




  //this is how we handle things without redux
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Here, you'll integrate the API call for authentication

  //   try {

  //     const response = await axios.post('http://localhost:3000/api/users/auth', 
  //       {email, password},
  //       {withCredentials: true}
  //     );
  //     const user = response.data
  //     localStorage.setItem('user', user)
  //     console.log(response.data)


  //     if (user.role === "admin") {
  //       navigate("/admin");
  //     } else {
  //       navigate("/home");
  //     }
      
  //   } catch (error) {
      
  //     if(error.response.data.message){
  //       console.log(error.response.data.message)
  //     } else {
  //       console.log("Something went wrong. Please try again!" ,error)
  //     }
      
  //   }


  // };

  //with redux-toolkit
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login({ email, password }))
      .unwrap()
      .then((response) => {
        // Redirect after successful login along with register. else back to login
        // if (response.data.role === "admin") {
          navigate("/admin/users");
        // } else {
          navigate("/login");
        // }
      })
      .catch((err) => console.error("Login error:", err));
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
          Login to LocalShop
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        {/* Sign-Up Button */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button component={Link} to="/register" variant="text">
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};
