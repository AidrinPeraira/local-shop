import { asyncHandler } from "../middlewares/asyncHandler.js";
import { generateOTP, sendOTPEmail } from "../utils/emailOTP.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from "bcryptjs";
import otpSchema from "../models/otpModel.js";

export const sendOTP = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;

    await otpSchema.deleteMany({
      $or: [{ email: email }, { otpExpiresAt: { $lt: Date.now() } }],
    });

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
    }, 120000);

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
  
  //delete any expired otp before searching
  await otpSchema.deleteMany({ otpExpiresAt: { $lt: Date.now() } });
  
  const otpServed = await otpSchema.findOne({ email });
  
  if (!otpServed) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "OTP expired or not found"
    });
    return;
  }

  const isOtpValid = await bcrypt.compare(otpRecieved, otpServed.otp);
  
  if (isOtpValid) {
    await otpSchema.deleteOne({ email });
    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "OTP Verified Successfully",
    });
    return;
  }

  // If OTP is invalid, handle attempts
  const newAttemptCount = Number(otpServed.otpAttempt) + 1;
  
  if (newAttemptCount >= 3) {
    // If attempts exceed limit, delete OTP and ask user to request new one
    await otpSchema.deleteOne({ email });
    res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: "Maximum attempts reached. Please request a new OTP"
    });
    return;
  }
  
  // Update attempt counter and inform user of remaining attempts
  await otpSchema.findOneAndUpdate(
    { email },
    { otpAttempt: newAttemptCount },
    { new: true }
  );

  res.status(HTTP_CODES.BAD_REQUEST).json({
    success: false,
    message: `Invalid OTP. ${3 - newAttemptCount} attempts remaining`
  });
});
