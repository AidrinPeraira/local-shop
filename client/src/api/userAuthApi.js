import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});


export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)