import { asyncHandler } from "../middlewares/asyncHandler.js";
import OTP from "../models/otpModel.js";
import { generateOTP, sendOTPEmail } from "../utils/emailOTP.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from "bcryptjs";
import otpSchema from "../models/otpModel.js";

export const sendOTP = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const otp = generateOTP();

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTP = new otpSchema({
      email: email,
      otp: otp,
      verifyStatus: false,
      otpExpiresAt: Date.now() + 120000,
      otpAttempt: 0,
    });

    await newOTP.save();

    //set a timer to delete otp if not verified. use find one and delete
    setTimeout(async () => {
      const delOtp = await otpSchema.findOne({ email });
      if (delOtp && !delOtp.verifyStatus) {
        await otpSchema.deleteOne({ _id: delOtp._id });
      }
    }, 18000); //1 min extra

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: `OTP Sent Successfully to ${email}`,
      email: email,
    });

  } catch (error) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
        console.log(error)
        throw new Error("Failed to send OTP")
  }
});


