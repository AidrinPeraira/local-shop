import { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

import {
  BarChart3,
  Package,
  ShoppingBag,
  DollarSign,
  Star,
  Truck,
  AlertCircle,
  RefreshCcw,
  Store,
} from "lucide-react";
import { logoutSeller } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "../hooks/use-toast";
import { fetchCategories } from "../../redux/features/categoriesSlice";

export function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {toast} = useToast()

  

  const navigation = [
    { name: "Dashboard", icon: BarChart3, href: "/seller" },
    { name: "Products", icon: Package, href: "/seller/products" },
    { name: "Orders", icon: ShoppingBag, href: "/seller/orders" },
    { name: "Earnings", icon: DollarSign, href: "/seller/earnings" },
    { name: "Reviews", icon: Star, href: "/seller/reviews" },
    { name: "Shipping", icon: Truck, href: "/seller/shipping" },
    { name: "Inventory", icon: Store, href: "/seller/inventory" },
    { name: "Returns", icon: RefreshCcw, href: "/seller/returns" },
    { name: "Support", icon: AlertCircle, href: "/seller/support" },
  ];


  const handleSignout = useCallback(() => {
    console.log("trying to logout");
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
