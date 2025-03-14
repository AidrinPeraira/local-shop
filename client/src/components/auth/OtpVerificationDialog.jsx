import React, { useEffect, useState } from "react";
import { CheckIcon, ClockIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { toast } from "../../components/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OtpInput from "./OtpInput";


const OtpVerificationDialog = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  // Handle OTP timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    // Simulate API call to resend OTP
    toast({
      title: "OTP Resent",
      description: `A new verification code has been sent to ${email}`,
    });
    setTimeLeft(120); // Reset timer
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock OTP verification - would connect to actual backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Success",
        description: "Your email has been verified successfully",
      });
      
      // Call success callback if provided, otherwise close the dialog
      if (onVerificationSuccess) {
        onVerificationSuccess();
      } else {
        onClose();
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            We've sent a verification code to <span className="font-medium">{email}</span>.
            Please enter the code below to verify your email address.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <OtpInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={isSubmitting}
          />

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <ClockIcon className="h-4 w-4" />
            <span>
              {timeLeft > 0 ? (
                <>Code expires in {formatTime(timeLeft)}</>
              ) : (
                <>Code expired</>
              )}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            disabled={timeLeft > 0 || isSubmitting}
            onClick={handleResendOtp}
            className="w-full sm:w-auto"
          >
            Resend Code
          </Button>
          <Button
            onClick={handleVerifyOtp}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationDialog;