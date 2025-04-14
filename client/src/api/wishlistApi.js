import API from "./apiConfig";

//need apis for the following
export const addToWishlistApi = (data) => API.post("/wishlist/add", data) 
export const removeFromWishlistApi = (productId) => API.delete(`/wishlist/remove/${productId}`) 
export const getWishlistApi = () => API.get("/wishlist" )
export const getWishlistCountApi = () => API.get("/wishlist/count" )