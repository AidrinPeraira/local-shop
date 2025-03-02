import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

import {
  BarChart3,
  Box,
  Users,
  ShoppingBag,
  Computer,
  Store,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useToast } from "../hooks/use-toast";
import { logoutAdmin } from "../../redux/features/userSlice";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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
  }, [dispatch, navigate]);

  const navigation = [
    { name: "Dashboard", icon: BarChart3, href: "/admin" },
    { name: "Categories", icon: Box, href: "/admin/categories" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Sellers", icon: Store, href: "/admin/sellers" },
    { name: "Admins", icon: Computer, href: "/admin/staff" },
    { name: "Products", icon: ShoppingBag, href: "/admin/products" },
  ];

  return (
    <div className="min-h-screen bg-admin">
      <DashboardSidebar
        titile={"Admin"}
        pages={navigation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <DashboardHeader handleSignout={handleSignout} />
        <div className="p-6 mt">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
