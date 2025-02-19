import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const sendOTP = (data) => API.post("/verify/email/send", data);
export const verifyOTP = (data) => API.post("/verify/email/verify", data);

