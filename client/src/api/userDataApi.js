import axios from "axios";
import { configuration } from "../configuration";

const API = axios.create({
  baseURL: configuration.baseURL,
  withCredentials: true,
});

//buyer apis for admin
export const getAllUsersApi = (querry) => API.get(`/users/all?${querry}`);
export const activateUserApi = (userId) => API.patch(`/users/${userId}/activate`);
export const deactivateUserApi = (userId) => API.patch(`/users/${userId}/deactivate`);
