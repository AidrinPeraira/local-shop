import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); 

  useEffect(() => {
    if (user) {
      navigate(user.role == 'admin' ? "/admin" : 
        user.role == "seller" ? "/seller" : "/"
      );
    } else {
        return
    }
    //this is how we remove history from window back button
    window.history.replaceState(null, "", window.location.href);
  }, [user, navigate]);
};

