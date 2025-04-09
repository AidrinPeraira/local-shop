import API from "./apiConfig";

export const getVendorPayoutsApi = (params) => 
  API.get(`/transactions/admin/vendor-payouts?${new URLSearchParams(params)}`);


export const processVendorPayoutApi = (payoutIds) => 
  API.post(`/transactions/admin/process-payouts`, { payoutIds });

