import API from "./apiConfig";

//need apis for the following
export const sellerAddProductApi = (data) => API.post("/products/add", data)
export const sellerEditProductApi = (data, id) => API.patch(`/products/edit/${id}`, data)
export const sellerDeleteProductApi = (id) => API.delete(`/products/edit/${id}`)
export const getSellerProductsApi = () => API.get("/products/get")
export const getShopProductsApi = (querry) => API.get(`/products/shop?${querry}`)
export const getProductDetailsApi = (slug, id) => API.get(`/products/${slug}/${id}`)
