import { Bell, Link, LogIn, Menu, Search, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationsDropdown } from "../ui/notification-dropdown";
import ProfileDropdown from "../ui/profile-dropdown";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/features/userSlice";
import { useToast } from "../hooks/use-toast";

const AdminHeader = ({ onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profileRef = useRef();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast()

  const handleSubmit = () => {};

  const handleSignout = useCallback(() => {
    console.log("trying to logout");
    dispatch(logoutAdmin())
      .unwrap()
      .then(() => {
        toast({
          title: "Logged Out",
          description: "See you later!",
          variant: "default",
        });
        navigate("/admin/login");
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
  }, []);



  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #1234 has been placed",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Gaming Mouse is running low on stock",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment for Order #1233 confirmed",
      timestamp: "3 hours ago",
      read: true,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          
        </div>
        <div className="flex items-center gap-4">
          <NotificationsDropdown notifications={notifications} />
          <ProfileDropdown user={user} onSignOut={handleSignout} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
