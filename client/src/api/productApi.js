import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});


//need apis for the following
export const sellerAddProductApi = (data) => API.post("/products/add", data)
export const sellerEditProductApi = (data, id) => API.patch(`/products/edit/${id}`, data)
export const sellerDeleteProductApi = (id) => API.delete(`/products/edit/${id}`)
export const getSellerProductsApi = () => API.get("/products/get")