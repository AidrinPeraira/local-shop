import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});


//need apis for the following
export const sellerAddProduct = (data) => API.post("/products/add", data)
