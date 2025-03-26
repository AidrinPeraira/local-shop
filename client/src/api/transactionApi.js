import API from "./apiConfig";

// Transaction APIs
export const getAllTransactionsApi = (params) => API.get(`/transactions/admin?${new URLSearchParams(params)}`);

export const getTransactionByIdApi = (transactionId) => API.get(`/transactions/admin/${transactionId}`);

export const updateTransactionStatusApi = (transactionId, status) => API.put(`/transactions/admin/${transactionId}`, { status });

