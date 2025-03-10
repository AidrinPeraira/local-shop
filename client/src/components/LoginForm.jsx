import { useDebugValue, useState } from "react";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleAuthUser, loginUser } from "../redux/features/userSlice";
import { useToast } from "./hooks/use-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuthApi } from "../api/userAuthApi";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        toast({
          title: "Logged In",
          description: "Welcome back to localShop. Happy Shopping!",
          variant: "default",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "Reg Dispatch Error: ",
          error || "Some error occured. Please try again"
        );
        toast({
          title: "Registration Error!",
          description: error,
          variant: "destructive",
        });
      });
  };

  //google login

  const responseGoogle = async (authResult) => {
    try {
      if(authResult.code){
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
      console.log(error)
      toast({
        title: "Google Auth Error!",
        description: error.response?.data?.message || "Authentication failed",
        variant: "destructive",
      });
    }
  };


  const googleLogin = useGoogleLogin({
    onSuccess : responseGoogle,
    onError : responseGoogle,
    flow : 'auth-code',
  })

  
  return (
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

      <Button
        type="button"
        className="w-full bg-red-500 text-white hover:bg-red-600"
        onClick={googleLogin}
      >
        Sign in with Google
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text hover:opacity-70 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
