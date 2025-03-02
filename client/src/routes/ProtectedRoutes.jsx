import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../components/hooks/use-toast";


const ProtectedRoute = ({ allowedRoles }) => {
  //allowed roles taken as a prop is supposed to be an array of permisavle roles. makes it easier to add roles in future
  const user  = useSelector((state) => state.user.user);
  const location = useLocation();
  const {toast } = useToast()

  //user not logged in
  if (!user) {
    const loginPath = location.pathname.startsWith("/seller")
      ? "/seller/login"
      : location.pathname.startsWith("/admin")
        ? "/admin/login" 
        : "/login";

    toast({
      title: "Not Authorized",
      description: "Please login to continue!",
      variant: "default",
    });

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  //user not authorised
  if (!allowedRoles.includes(user.role)) {
    const verifiedUserPath = 
      user.role === "seller" 
        ? "/seller/dashboard"
        : user.role === "admin" 
          ? "/admin/dashboard" 
          : "/"; 

    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });

    return <Navigate to={verifiedUserPath} replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
