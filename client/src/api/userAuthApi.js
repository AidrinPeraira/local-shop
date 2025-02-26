import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});

//buyer apis
export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)
export const userLogoutApi = () => API.post("/users/logout")

//admin apis
export const adminLoginApi = (data) => API.post("/admin/login", data)
export const adminLogoutApi = (data) => API.post("/admin/logout", data) 