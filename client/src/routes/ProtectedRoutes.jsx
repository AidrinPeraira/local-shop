import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../components/hooks/use-toast";
import { useEffect, useState } from "react";


const ProtectedRoute = ({ allowedRoles }) => {
  //allowed roles taken as a prop is supposed to be an array of permisavle roles. makes it easier to add roles in future
  const user  = useSelector((state) => state.user.user);
  const location = useLocation();
  const {toast } = useToast()
  const [redirectPath, setRedirectPath] = useState(null);

  //putting the toast inside consition causes direct  re renders. put it in useEffect
  
  useEffect(() => {

    if (!user) {

      //checkin=g the user for being logged in

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

      setRedirectPath(loginPath);
    } else if (!allowedRoles.includes(user.role)) {

      //checking the user for being authorised

      const verifiedUserPath =
        user.role === "seller"
          ? "/seller"
          : user.role === "admin"
          ? "/admin"
          : "/";


      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });

      setRedirectPath(verifiedUserPath);
    }
  }, [user, allowedRoles, location.pathname, toast]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
