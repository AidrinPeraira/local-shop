
import { NavLink } from "react-router-dom";
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

export default function SellerSidebar({ isOpen, onToggle }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className={`font-bold text-xl ${!isOpen && "hidden"}`}>Seller Hub</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-admin-accent text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className={`${!isOpen && "hidden"}`}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
