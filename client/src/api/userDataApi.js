import API from "./apiConfig";

//buyer apis for admin
export const getAllUsersApi = (querry) => API.get(`/users/all?${querry}`);
export const activateUserApi = (userId) => API.patch(`/users/${userId}/activate`);
export const deactivateUserApi = (userId) => API.patch(`/users/${userId}/deactivate`);
