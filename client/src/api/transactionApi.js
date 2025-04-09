import API from "./apiConfig";

// Transaction APIs
export const getAllTransactionsApi = (params) => API.get(`/transactions/admin?${new URLSearchParams(params)}`);

export const getAdminBalanceApi = () => API.get('/transactions/admin/balance');