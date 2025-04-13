import API from "./apiConfig";

//need apis for the following
export const addToCartAPI = (data) => API.post("/cart/add", data) 
export const updateCartAPI = (data) => API.post("/cart/update", data) 
export const getCartItemsAPI = () => API.get("/cart/get" ) 
export const processCartItemsAPI = (data) => API.post("/cart/buynow", data ) 
export const getCartItemsCountAPI = () => API.get("/cart/count")