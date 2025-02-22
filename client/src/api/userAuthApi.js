import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

//buyer apis
export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)
export const userLogoutApi = () => API.post("/users/logout")

//admin apis
export const adminLoginApi = (data) => API.post("/admin/login", data)
export const adminLogoutApi = (data) => API.post("/admin/logout", data)