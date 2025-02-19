import express from "express";
import { sendOTP, verifyOTP } from "../controller/otpController.js";

const verifyRoute = express.Router();

verifyRoute.route("/email/send").post(sendOTP);
verifyRoute.route("/email/verify").post(verifyOTP);

export default verifyRoute;
