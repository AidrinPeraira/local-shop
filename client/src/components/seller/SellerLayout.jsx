import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

import {
  BarChart3,
  Package,
  ShoppingBag, 
  ArrowLeftFromLine,
  Landmark,
  Sailboat
} from "lucide-react";
import { logoutSeller } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "../hooks/use-toast";

export function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {toast} = useToast()


  const navigation = [
    { name: "Dashboard", icon: BarChart3, href: "/seller" },
    { name: "Sales", icon: Sailboat, href: "/seller/sales" },
    { name: "Products", icon: Package, href: "/seller/products" },
    { name: "Orders", icon: ShoppingBag, href: "/seller/orders" },
    { name: "Returns", icon: ArrowLeftFromLine, href: "/seller/returns" },
    { name: "Transactions", icon: Landmark, href: "/seller/transactions" },
  ];


  const handleSignout = useCallback(() => {
    dispatch(logoutSeller())
      .unwrap()
      .then(() => {
        toast({
          title: "Logged Out",
          description: "See you later!",
          variant: "default",
        });
        navigate("/seller/login");
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


  


  return (
    <div className="min-h-screen bg-admi">
      <DashboardSidebar titile={'Seller'} pages={navigation} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <DashboardHeader handleSignout={handleSignout} />
        <div className="p-6 mt">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
