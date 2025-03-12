import API from "./apiConfig";

//buyer apis
export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)
export const userLogoutApi = () => API.post("/users/logout")

//admin apis
export const adminLoginApi = (data) => API.post("/admin/login", data)
export const adminLogoutApi = (data) => API.post("/admin/logout", data) 

//seller apis
export const sellerRegApi = (data) => API.post('/seller/register', data)
export const sellerLoginApi = (data) => API.post('/seller/login', data)
export const sellerLogoutApi = (data) => API.post('/seller/logout', data)

//user buyer google auth api
export const googleAuthApi = (code) => API.post(`/users/google?code=${code}`, code)

