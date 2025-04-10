import API from "./apiConfig";

export const getVendorPayoutsApi = (params) => 
  API.get(`/payouts/admin/vendor-payouts?${new URLSearchParams(params)}`);


export const processVendorPayoutApi = (data) => 
  API.post(`/payouts/admin/process-payouts`,  data );

