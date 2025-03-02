import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/hooks/use-toast";
import { Button } from "../../components/ui/button";
import { useDispatch } from "react-redux";
import { loginAdmin, loginSeller } from "../../redux/features/userSlice";
import { useRedirectIfAuthenticated } from "../../components/hooks/useRedirectIfAuthenticated";

const SellerLogin = () => {
  useRedirectIfAuthenticated()
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginSeller({ email, password }))
      .unwrap()
      .then(() => {
        toast({
          title: "Logged In",
          description: "Welcome back to localShop. Happy Selling!",
          variant: "default",
        });
        navigate("/seller");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Registration Error!",
          description: error,
          variant: "destructive",
        });
      });
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
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Seller Login</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
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

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text hover:opacity-70 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full hover:opacity-90">
              Sign in
            </Button>

            <div className="flex items-center space-x-2">
              <div className="w-full border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/seller/register"
                className="text hover:opacity-70 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>© 2025 localShop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SellerLogin;
