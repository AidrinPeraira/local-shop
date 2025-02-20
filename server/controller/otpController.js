import { asyncHandler } from "../middlewares/asyncHandler.js";
import OTP from "../models/otpModel.js";
import { generateOTP, sendOTPEmail } from "../utils/emailOTP.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from "bcryptjs";
import otpSchema from "../models/otpModel.js";

export const sendOTP = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    await otpSchema.deleteOne({ email });
    const otp = generateOTP();

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTP = new otpSchema({
      email: email,
      otp: hashedOTP,
      verifyStatus: false,
      otpExpiresAt: Date.now() + 120000,
      otpAttempt: 1,
    });

    await newOTP.save();

    //set a timer to delete otp if not verified. use find one and delete
    setTimeout(async () => {
      const delOtp = await otpSchema.findOne({ email });
      if (delOtp && !delOtp.verifyStatus) {
        await otpSchema.deleteOne({ _id: delOtp._id });
      }
    }, 120000); //1 min extra

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: `OTP Sent Successfully to ${email}`,
      email: email, //to be removed if not used
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error("Failed to send OTP");
  }
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otpRecieved } = req.body;

  const otpServed = await otpSchema.findOne({ email });

  if (!otpServed) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error("OTP Fetch Failed. Please try agian later");
  } else {
    const isOtpValid = await bcrypt.compare(otpRecieved, otpServed.otp);

    if (isOtpValid) {
      await otpSchema.deleteOne({ email });
      res.json({
        success: true,
        message: "OTP Verified Succesfully",
      });
    } else {
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Invalid OTP");
    }
  }
});


