import API from "./apiConfig";

//need apis for the following
export const createOrderApi = (data) => API.post("/orders/create", data)

export const getUserOrdersApi = (page = 1, limit = 5, sort = 'desc', search = '') => 
  API.get(`/orders/get?page=${page}&limit=${limit}&sort=${sort}&search=${search}`);

export const cancelOrderApi = (orderId) => 
  API.post(`/orders/${orderId}/cancel`);