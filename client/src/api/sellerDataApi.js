import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});

export const getAllSellersApi = (query) => API.get(`/seller/all?${query}`);
export const activateSellerApi = (sellerId) => API.patch(`/seller/${sellerId}/activate`);
export const deactivateSellerApi = (sellerId) => API.patch(`/seller/${sellerId}/deactivate`);