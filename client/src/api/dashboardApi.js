import API from "./apiConfig";

export const getDashboardStatsApi = (timeRange) => 
  API.get(`/admin/dashboard/stats?timeRange=${timeRange}`);

