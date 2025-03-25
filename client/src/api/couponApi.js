import API from "./apiConfig";


export const adminGetCouponsApi = (params) => API.get("/coupons/get", { params })
export const adminCreateCouponApi = (data) => API.post("/coupons/create", data)
export const adminUpdateCouponApi = (data) => API.put("/coupons/edit", data)
export const adminDeleteCouponApi = (id) => API.delete(`/coupons/delete/${id}`)
