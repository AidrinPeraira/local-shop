import API from "./apiConfig";

export const sendOTP = (data) => API.post("/verify/email/send", data);
export const verifyOTP = (data) => API.post("/verify/email/verify", data);

