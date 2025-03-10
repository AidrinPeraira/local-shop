import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/hooks/use-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/otp/send", { email });
      setStep(2);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the OTP",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/otp/verify", { email, otpRecieved: otp });
      setStep(3);
      toast({
        title: "OTP Verified",
        description: "Please enter your new password",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/reset-password", { email, newPassword });
      toast({
        title: "Success",
        description: "Password reset successful. Please login with your new password",
        variant: "default",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Send OTP</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;