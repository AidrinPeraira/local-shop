import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, LogIn } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/features/userSlice";
import { useToast } from "../hooks/use-toast";

const MainNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { toast } = useToast();
  const { count: cartCount } = useSelector((state) => state.cart);
  const { count: wishlistCount } = useSelector((state) => state.wishlist);

  //pop up logic
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //search logic
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search");

    // Preserve existing query parameters
    const currentParams = new URLSearchParams();
    currentParams.set("search", searchQuery);

    navigate(`/shop?${currentParams.toString()}`);
  };

  const handleSignout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        setIsLoggedIn(false);
        toast({
          title: "Logged Out",
          description: "See you later!",
          variant: "default",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "Logout Error: ",
          error || "Some error occured. Please try again"
        );
        toast({
          title: "Logout Error!",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="w-full bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <span className="text-2xl font-bold">
              local<span className="text-primary">Shop</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                name="search"
                type="text"
                placeholder="Search for anything..."
                className="w-full pl-12 pr-4 h-12 rounded-full bg-gray-50 border-gray-200 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* saved-list */}
            <div className="relative">
              <Link to={"/saved-list"}>
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Shopping Cart */}
            <div className="relative">
              <Link to={"/cart"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCart(!showCart);
                  }}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfile(!showProfile);
                }}
              >
                {isLoggedIn && user?.username ? (
                  <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </Button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl p-4 border border-gray-200">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-3 border-b pb-2 mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                          <User />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {user ? user.username : ""}
                        </h3>
                      </div>
                      <div className="mt-2 space-y-2">
                        <Link
                          to="/profile"
                          className="block text-sm text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-2 rounded-md transition"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={handleSignout}
                          className="block w-full text-left text-sm text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-2 rounded-md transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full text-sm text-primary font-semibold hover:underline flex items-center justify-center py-2 transition"
                      >
                        <LogIn className="w-4 h-4 mr-2" /> Sign In
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
