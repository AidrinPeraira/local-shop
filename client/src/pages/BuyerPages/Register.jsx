import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Mail, User, Key, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../../components/hooks/use-toast.js";
import { validateUserData } from "../../utils/validateData.js";
import { sendOTP, verifyOTP } from "../../api/emailOtpApi.js";
import {
  registerUser,
  googleAuthUser,
} from "../../redux/features/userSlice.js";
import { useGoogleLogin } from "@react-oauth/google";
import { useRedirectIfAuthenticated } from "../../components/hooks/useRedirectIfAuthenticated.js";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    referralCode: "",
  });
  const [showPopup, setShowPopup] = useState(false); //pop up for email otp
  const [userOTP, setUserOTP] = useState(null);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataValid = validateUserData(
      formData.username,
      formData.email,
      formData.phone,
      formData.password
    );

    if (dataValid !== true) {
      toast({
        title: "Invalid Data",
        description: dataValid,
        variant: "default",
      });
      setIsLoading(false);
      return;
    }
    const mailOTP = await sendOTP({ email: formData.email });
    if (mailOTP.data.success) {
      toast({
        title: "Send OTP Success",
        description: mailOTP.data.message,
        variant: "default",
      });
      setIsLoading(false);
      setShowPopup(true); // Show the popup for email verification
    } else {
      toast({
        title: "Send OTP Error",
        description: mailOTP.data.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useRedirectIfAuthenticated()

  const handleEmailConfirm = async () => {
    try {
      const response = await verifyOTP({
        email: formData.email,
        otpRecieved: userOTP,
      });
  
      // If verification successful
      if (response.data.success) {
        toast({
          title: "OTP verified successfully!",
          description: response.data.message,
          variant: "default",
        });
        setShowPopup(false);
  
        // Add user to the database
        try {
          await dispatch(registerUser(formData)).unwrap();
          toast({
            title: "Registered and Logged In",
            description: "Happy Shopping",
            variant: "default",
          });
          navigate("/");
        } catch (error) {
          console.error("Reg Dispatch Error:", error);
          toast({
            title: "Registration Error!",
            description: error || "Failed to register user",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      // Handle OTP verification errors
      console.error("OTP Error:", error.response?.data);
      toast({
        title: "OTP Error",
        description: error.response?.data?.message || "Failed to verify OTP",
        variant: "destructive",
      });
    }
  };

  const handleEmailCancel = () => {
    setShowPopup(false); // Close the popup without submitting
    setCountdown(120);
    setCanResend(false);
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        dispatch(googleAuthUser(authResult.code))
          .unwrap()
          .then(() => {
            toast({
              title: "Logged In",
              description: "Successfully logged in with Google!",
              variant: "default",
            });
            navigate("/");
          })
          .catch((error) => {
            console.error("Google Auth Error: ", error);
            toast({
              title: "Google Auth Error!",
              description: error,
              variant: "destructive",
            });
          });
      }
    } catch (error) {
      toast({
        title: "Google Auth Error!",
        description: error.response?.data?.message || "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  //useEffect to start countdown
  useEffect(() => {
    let timer;
    if (showPopup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      toast({
        title: "OTP Expired",
        description: "OTP Time limit exceeded. Please resend OTP",
        variant: "destructive",
      });
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [showPopup, countdown]);

  //resend otp
  const handleResendOtp = async (e) => {
    const mailOTP = await sendOTP({ email: formData.email });
    if (mailOTP.data.success) {
      toast({
        title: "Send OTP Resend Success",
        description: mailOTP.data.message,
        variant: "default",
      });
      setCountdown(120); // Reset timer
      setCanResend(false); // Show the popup for email verification
    } else {
      toast({
        title: "Resend OTP Error",
        description: mailOTP.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center">
            <Link to="/">
              <span className="text-2xl font-bold">
                local<span className="text-primary">Shop</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-primary">
                Create an account
              </h1>
              <p className="text-gray-600 mt-2">Join us to start shopping</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6 ">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="number"
                    placeholder="Enter your phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <div className="relative">
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="Enter referral code if you have one"
                    value={formData.referralCode}
                    onChange={(e) =>
                      setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })
                    }
                    className="pl-3"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg hover:bg/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-full border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="w-full border-t border-gray-300"></div>
              </div>

              <Button
                type="button"
                className="w-full bg-red-500 text-white hover:bg-red-600"
                onClick={googleLogin}
              >
                Sign in with Google
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text hover:text/90 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>© 2025 localShop. All rights reserved.</p>
      </footer>

      {/* Email Verification Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Email OTP</h2>
            <p className="text-sm text-gray-700 mb-4">
              Please enter the OTP sent to your email: {formData.email}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Time remaining: {Math.floor(countdown / 60)}:
              {String(countdown % 60).padStart(2, "0")}
            </p>

            <Input
              id="email"
              type="password"
              placeholder="Enter OTP"
              value={userOTP}
              onChange={(e) => setUserOTP(e.target.value)}
              className="pl-10"
              required
            />

            <div className="flex justify-between mt-5">
              <Button
                onClick={handleEmailCancel}
                className="bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmailConfirm}
                className="bg-primary hover:bg-primary/90"
              >
                Confirm
              </Button>
            </div>

            <Button
              onClick={handleResendOtp}
              disabled={!canResend}
              className={`w-full mt-4 ${
                !canResend ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register
