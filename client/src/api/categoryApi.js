import API from "./apiConfig";

//need apis for the following
export const getAllCategoriesAPI = (queryParams) => API.get(`/category?${queryParams}`)
export const getActiveCategoriesAPI = () => API.get("/category/active")

export const createNewCategoryAPI = (data) => API.post("/category/create", data)
export const editCurrentCategoryAPI = (data) => API.patch(`/category/edit/${data._id}`, data)
export const deleteCurrentCategoryAPI = (data) => API.delete(`/category/delete/${data._id}`)
/**
 * get all cat
 * get cat by id
 * create cat
 * update cat
 * delete cat
 */