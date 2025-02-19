import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

//if using jwt token stored in local storage write the code here to add cookie to the requests
/**
 * 
 * API.interceptors.request.use((config) => {
  const token = Cookies.get("token");  // Retrieving the token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 */

//write the functions to make the request here.
export const registerUser = (userData) => API.post("/users/register", userData);
export const loginUser = (userData) => API.post("/users/auth", userData);
export const getCurrentUser = (userData) => API.get('/users/profile', userData)
export const logoutUser = () => API.post('/users/logout')
export const updateUserProfile = (userData) => API.put('/users/profile', userData)

