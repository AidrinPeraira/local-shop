import API from "./apiConfig";

export const getSalesReportApi = (params) => 
  API.get("/sales", { params });