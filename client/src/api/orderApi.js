import API from "./apiConfig";

//need apis for the following
export const createOrderApi = (data) => API.post("/orders/create", data) 