import API from "./apiConfig";

//need apis for the following for user
export const createOrderApi = (data) => API.post("/orders/create", data);

export const getUserOrdersApi = (
  page = 1,
  limit = 5,
  sort = "desc",
  search = ""
) =>
  API.get(
    `/orders/get?page=${page}&limit=${limit}&sort=${sort}&search=${search}`
  );

export const getOrderByIdApi = (orderId) => API.get(`/orders/get/${orderId}`);
export const cancelOrderApi = (orderId) => API.patch(`/orders/cancel/${orderId}`);
export const returnOrderApi = (orderId, returnReason) => API.patch(`/orders/return/${orderId}`, { returnReason });

//order apis for sellers
export const getSellerOrdersApi = (
  page = 1,
  limit = 6,
  status = "",
  sort = "desc",
  search = ""
) =>
  API.get(
    `/orders/seller?page=${page}&limit=${limit}&status=${status}&sort=${sort}&search=${search}`
  );

export const updateOrderStatusApi = (orderId, status) => API.patch(`/orders/status/${orderId}`, { status });

//order api for razor pay
export const createRazorpayOrderApi = (data) => API.post("/orders/create-razorpay-order", data);
export const verifyRazorpayPaymentApi =  (data) => API.post("/orders/verify-payment", data);
