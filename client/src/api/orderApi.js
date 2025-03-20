import API from "./apiConfig";

//need apis for the following for user
export const createOrderApi = (data) => API.post("/orders/create", data)

export const getUserOrdersApi = (page = 1, limit = 5, sort = 'desc', search = '') => 
  API.get(`/orders/get?page=${page}&limit=${limit}&sort=${sort}&search=${search}`);

export const cancelOrderApi = (orderId) => 
  API.post(`/orders/${orderId}/cancel`);



//order apis for sellers
export const getSellerOrdersApi = (page = 1, limit = 6, status = '', sort = 'desc', search = '') => 
  API.get(`/orders/seller?page=${page}&limit=${limit}&status=${status}&sort=${sort}&search=${search}`);

export const updateOrderStatusApi = (orderId, status) => 
  API.patch(`/orders/status/${orderId}`, { status });