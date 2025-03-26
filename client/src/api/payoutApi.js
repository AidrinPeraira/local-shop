import API from "./apiConfig";

export const getVendorPayoutsApi = (params) => 
  API.get(`/transactions/admin/vendor-payouts?${new URLSearchParams(params)}`);

export const getBuyerRefundsApi = (params) => 
  API.get(`/transactions/admin/buyer-refunds?${new URLSearchParams(params)}`);

export const processVendorPayoutApi = (payoutIds) => 
  API.post(`/transactions/admin/process-payouts`, { payoutIds });

export const processBuyerRefundApi = (refundIds) => 
  API.post(`/transactions/admin/process-refunds`, { refundIds });