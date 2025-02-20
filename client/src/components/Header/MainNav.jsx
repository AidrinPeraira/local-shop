import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, LogIn } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MainNav = () => {
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isLoggedIn = false; // Replace with actual auth state
  
  const navigate = useNavigate();

  const cartRef = useRef();
  const wishlistRef = useRef();
  const profileRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        wishlistRef.current &&
        !wishlistRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowCart(false);
        setShowWishlist(false);
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search");
    navigate(`/shop?search=${searchQuery}`);
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

            {/* Wishlist */}
            <div className="relative" ref={wishlistRef}>
              <Button variant="ghost" size="icon" className="relative" onClick={(e) => { e.stopPropagation(); setShowWishlist(!showWishlist); }}>
                <Heart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
              {showWishlist && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-sm font-medium">Wishlist</h3>
                  <p className="text-sm text-gray-500 mt-2">Your wishlist is empty</p>
                  <Link to="/wishlist" className="block mt-2 text-sm text-primary hover:underline">View Wishlist</Link>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <div className="relative" ref={cartRef}>
              <Button variant="ghost" size="icon" className="relative" onClick={(e) => { e.stopPropagation(); setShowCart(!showCart); }}>
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
              {showCart && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-sm font-medium">Shopping Cart</h3>
                  <p className="text-sm text-gray-500 mt-2">Your cart is empty</p>
                  <Link to="/cart" className="block mt-2 text-sm text-primary hover:underline">View Cart</Link>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); }}>
                <User className="h-6 w-6" />
              </Button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-4">
                  {isLoggedIn ? (
                    <>
                      <h3 className="text-sm font-medium">John Doe</h3>
                      <div className="mt-2 space-y-2">
                        <Link to="/profile" className="block text-sm text-gray-700 hover:text-primary">View Profile</Link>
                        <button className="block w-full text-left text-sm text-gray-700 hover:text-primary">Sign Out</button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <button onClick={() => navigate('/login')} className="w-full text-sm text-primary font-semibold hover:underline flex items-center">
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
