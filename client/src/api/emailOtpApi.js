import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});


export const sendOTP = (data) => API.post("/verify/email/send", data);
export const verifyOTP = (data) => API.post("/verify/email/verify", data);

