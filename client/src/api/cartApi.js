import API from "./apiConfig";

//need apis for the following
export const addToCartAPI = (data) => API.post("/cart/add", data)