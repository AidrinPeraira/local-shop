import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { 
  User, 
  Settings, 
  Bell, 
  ShoppingBag, 
  Heart,
  CreditCard,
  Lock,
  MapPin,
  ShoppingCart
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
import ProfileOrders from "./ProfileOrders";
import ProfileAddress from "./ProfileAddress";

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const navigation = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "cart", label: "My Cart", icon: ShoppingCart },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "security", label: "Change Password", icon: Lock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo onManageAddresses={() => setActiveTab("addresses")}/>;
      case "orders":
        return <ProfileOrders/>;
      case "cart":
        navigate("/cart");
        return null;
      case "wishlist":
        navigate("/wishlist");
        return null;
      case "addresses":
        return <ProfileAddress/>;
      
      default:
        return <ProfileInfo/>;
    }
  };

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
                      activeTab === item.id
                        ? "bg-accent text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setActiveTab(item.id)}
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
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
