import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

import {
  BarChart3,
  Box,
  Users,
  ShoppingBag,
  Package,
  Store,
  Ticket,
  Landmark,
  Handshake,
  ArrowLeftFromLine,
  Wallet,
  Sailboat
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
          description: "Some error occured. Please try again",
          variant: "destructive",
        });
      });
  }, [dispatch, navigate]);

  const navigation = [
    { name: "Dashboard", icon: BarChart3, href: "/admin" },
    { name: "Sales", icon: Sailboat, href: "/admin/sales" },
    { name: "Categories", icon: Box, href: "/admin/categories" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Sellers", icon: Store, href: "/admin/sellers" },
    { name: "Products", icon: ShoppingBag, href: "/admin/products" },
    { name: "Orders", icon: Package, href: "/admin/orders" },
    { name: "Returns", icon: ArrowLeftFromLine, href: "/admin/returns" },
    { name: "Coupons", icon: Ticket, href: "/admin/coupons" },
    { name: "Transactions", icon: Landmark, href: "/admin/transactions" },
    { name: "Wallets", icon: Wallet, href: "/admin/user-wallets" },
    { name: "Payouts", icon: Handshake, href: "/admin/payouts" },
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
