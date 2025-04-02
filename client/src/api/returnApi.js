import API from "./apiConfig";

// User return APIs
export const requestReturnApi = (orderId, itemId, returnReason) => 
  API.post("/return/create", { orderId, itemId, returnReason });

// Seller return APIs
export const getReturnRequestsApi = (page = 1, limit = 10, status = "") => 
  API.get(`/return/getAll?page=${page}&limit=${limit}&status=${status}`);

export const updateReturnRequestApi = (returnId, data) => 
  API.patch(`/return/update/${returnId}`, data);