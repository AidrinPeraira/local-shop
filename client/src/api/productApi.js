import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});


//need apis for the following
export const sellerAddProductApi = (data) => API.post("/products/add", data)
export const getSellerProductsApi = () => API.get("/products/get")