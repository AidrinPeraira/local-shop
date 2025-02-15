
import { useState } from "react";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { email, password });
  };

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
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="rounded border-gray-300" />
          <span>Remember me</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-accent hover:text-accent/90 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-accent hover:text-accent/90 font-medium"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
