import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});


//admin actions
export const adminGetAllUsers = () => API.get('/users');
export const adminDeleteUserById = (userId) => API.delete(`/users/${userId}`)
export const getOneUserById = (userId) => API.get(`/users/${userId}`)
export const adminUpdateUserById = (userId, userData) => API.put(`/users/${userId}`, userData)
