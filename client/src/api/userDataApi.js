import API from "./apiConfig";

//buyer apis for admin
export const getAllUsersApi = (querry) => API.get(`/users/all?${querry}`);
export const activateUserApi = (userId) => API.patch(`/users/${userId}/activate`);
export const deactivateUserApi = (userId) => API.patch(`/users/${userId}/deactivate`);

//address apis
export const getUserAddressesApi = () => API.get(`users/address/get`);
export const addUserAddressApi = (data) => API.post(`users/address/add`, data);
export const editUserAddressApi = (data) => API.patch(`users/address/edit/${data.addressId}`, data);
export const deleteUserAddressApi = (data) => API.delete(`users/address/delete/${data.addressId}`, data);

