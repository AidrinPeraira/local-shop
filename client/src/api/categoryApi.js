import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});


//need apis for the following
export const getAllCategoriesAPI = () => API.get("/categories")
export const createNewCategoryAPI = () => API.get("/categories/create")
/**
 * get all cat
 * get cat by id
 * create cat
 * update cat
 * delete cat
 */