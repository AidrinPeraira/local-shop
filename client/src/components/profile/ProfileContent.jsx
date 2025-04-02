import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { 
  User, 
  ShoppingBag, 
  Heart,
  Lock,
  MapPin,
  ShoppingCart,
  Wallet
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const ProfileContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  const navigation = [
    { id: "info", label: "Profile Information", icon: User, path: "/profile/info" },
    { id: "orders", label: "My Orders", icon: ShoppingBag, path: "/profile/orders" },
    { id: "cart", label: "My Cart", icon: ShoppingCart, path: "/cart" },
    { id: "saved", label: "Saved Items", icon: Heart, path: "/saved-list" },
    { id: "wallet", label: "Wallet", icon: Wallet, path: "/profile/wallet" },
    { id: "addresses", label: "Addresses", icon: MapPin, path: "/profile/addresses" },
    { id: "security", label: "Change Password", icon: Lock, path: "/profile/security" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Side Navigation */}
        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-sm font-medium",
                      currentPath === item.id
                        ? "bg-accent text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;