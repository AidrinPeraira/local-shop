import API from "./apiConfig";

// Wallet info and balance
export const getWalletApi = () => API.get("/wallet");
export const getWalletBalanceApi = () => API.get("/wallet/balance");

// Transaction operations
export const processWalletPaymentApi = (data) => API.post("/wallet/pay", data);
export const processRefundApi = (data) => API.post("/wallet/refund", data);
export const addReferralRewardApi = (data) =>
  API.post("/wallet/referral", data);
export const addPromoCreditApi = (data) => API.post("/wallet/promo", data);

// Transaction history
export const getTransactionHistoryApi = (params) =>
  API.get("/wallet/transactions", { params });

export const getAdminWalletTransactionsApi = (params) =>
  API.get("/wallet/admin/transactions", { params });
