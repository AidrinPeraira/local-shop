import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Mail, User, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../components/hooks/use-toast";
import { validateUserData } from "../utils/validateData";
import { sendOTP, verifyOTP } from "../api/emailOtpApi.js";
import { registerUser } from "../redux/features/userSlice.js";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPopup, setShowPopup] = useState(false); //pop up for email otp
  const [userOTP, setUserOTP] = useState(null);

  const { toast } = useToast();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      return;
    }
    const mailOTP = await sendOTP({ email: formData.email });
    if (mailOTP.data.success) {
      toast({
        title: "Send OTP Success",
        description: mailOTP.data.message,
        variant: "default",
      });
      setShowPopup(true); // Show the popup for email verification
    } else {
      toast({
        title: "Send OTP Error",
        description: mailOTP.data.message,
        variant: "destructive",
      });
    }
  };

  const handleEmailConfirm = async () => {
    const response = await verifyOTP({
      email: formData.email,
      otpRecieved: userOTP,
    });

    if (response.data.success) {
      toast({
        title: "OTP verified succesfully!",
        description: response.data.message,
        variant: "default",
      });
      setShowPopup(false);

      //add user to the databse
      dispatch(registerUser(formData))
        .unwrap() //breaks open the promise to give value if success and throw rejectWithVakue error if rejected
        .then((response)=>{
          toast({
            title: "Registered and Logged In",
            description: "Happy Shopping",
            variant: "default",
          }); 
          navigate('/')
        })
        .catch((error)=>{
          console.error("Reg Dispatch Error: ", error || "Some error occured. Please try again") 
          toast({            
            title: "Registration Error!",
            description: error,
            variant: "destructive",
          });
        })

    } else {
      toast({
        title: "Invalid OTP",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const handleEmailCancel = () => {
    setShowPopup(false); // Close the popup without submitting
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

              <Button type="submit" className="w-full bg hover:bg/90">
                Create Account
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-full border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="w-full border-t border-gray-300"></div>
              </div>

              <Button
                type="button"
                className="w-full bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleSocialLogin("Google")}
              >
                Sign in with Google
              </Button>

              <Button
                type="button"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleSocialLogin("Facebook")}
              >
                Sign in with Facebook
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
          </div>
        </div>
      )}
    </div>
  );
};
