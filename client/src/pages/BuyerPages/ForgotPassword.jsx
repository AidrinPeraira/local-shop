import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  MailIcon,
  UserIcon,
  KeyIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "../../components/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import OtpInput from "../../components/ForgotPassword/OtpInput";
import { checkUserApi, resetUserPasswordApi } from "../../api/userAuthApi";
import { sendOTP, verifyOTP } from "../../api/emailOtpApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [resetStep, setResetStep] = useState("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("user123"); // Mocked username
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  useEffect(() => {
    let intervalId;

    if (timerActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, timeLeft]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Invalid email format.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call to check if email exists
      const response = await checkUserApi({ email });
      setUsername(response.data.username);
      // Move to next step
      setResetStep("confirm-user");
      toast({
        title: "Email Found",
        description: "Please confirm your username to continue",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Email not found. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call to verify username matches email
      const response = await sendOTP({ email });
      // Move to OTP verification step
      setResetStep("verify-otp");
      setTimeLeft(120);
      setTimerActive(true);
      toast({
        title: "Success",
        description: `${response.data.message}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Username verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await sendOTP({ email });
      // Reset timer
      setTimeLeft(120);
      setTimerActive(true);
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast({
        title: "Error",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call to verify OTP
      const response = await verifyOTP({ email, otpRecieved: otp });

      // Move to new password step
      setResetStep("new-password");
      toast({
        title: "OTP Verified",
        description: "Please set your new password",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    if (!passwordRegex.test(password)) {
       toast({
        title: "Error",
        description: "Password must be at least 6 characters long and contain at least one number, one uppercase letter, and one special character.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }   

    setIsSubmitting(true);

    try {
      // Mock API call to reset password
      const response = await resetUserPasswordApi({email, newPassword : password})

      // Show success
      setResetStep("success");
      toast({
        title: "Success",
        description: `${response.data.message}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <Link to="/" className="text-2xl font-bold">
          local<span className="text-primary">Shop</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToLogin}
                className="mr-2 h-8 w-8"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <CardTitle>Reset Your Password</CardTitle>
            </div>
            <CardDescription>
              {resetStep === "email" &&
                "Enter your email address to begin the password reset process."}
              {resetStep === "confirm-user" &&
                "Confirm your username to verify your identity."}
              {resetStep === "verify-otp" &&
                "Enter the verification code sent to your email."}
              {resetStep === "new-password" &&
                "Enter and confirm your new password."}
              {resetStep === "success" &&
                "Your password has been reset successfully."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {resetStep === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Checking..." : "Continue"}
                </Button>
              </form>
            )}

            {resetStep === "confirm-user" && (
              <form onSubmit={handleUserConfirm} className="space-y-4">
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <p className="text-sm mb-1">Associated account:</p>
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">{username}</span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Is this your account? If yes, please proceed to verify.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Verifying..."
                    : "Yes, Send Verification Code"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setResetStep("email")}
                  disabled={isSubmitting}
                >
                  No, Use Different Email
                </Button>
              </form>
            )}

            {resetStep === "verify-otp" && (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    A verification code has been sent to{" "}
                    <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Time remaining: {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </p>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    disabled={isSubmitting || timeLeft === 0}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || otp.length < 6 || timeLeft === 0}
                >
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    disabled={isSubmitting || timeLeft > 0}
                    onClick={handleResendOTP}
                  >
                    {timeLeft > 0
                      ? "Wait before resending"
                      : "Didn't receive a code? Resend"}
                  </Button>
                </div>
              </form>
            )}

            {resetStep === "new-password" && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isSubmitting}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            {resetStep === "success" && (
              <div className="text-center py-4">
                <div className="rounded-full bg-green-100 text-green-600 p-3 inline-flex mb-4">
                  <KeyIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Password Reset Complete
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </p>
                <Button onClick={handleBackToLogin} className="w-full">
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>

          {resetStep !== "success" && (
            <CardFooter className="flex justify-center border-t pt-4 text-sm text-muted-foreground">
              Remember your password?{" "}
              <Button
                variant="link"
                size="sm"
                className="px-1"
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
