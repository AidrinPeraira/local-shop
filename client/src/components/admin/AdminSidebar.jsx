
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Box,
  Users,
  ShoppingBag,
  MessageSquare,
  TicketIcon,
  Star,
  Truck,
  Store,
} from "lucide-react";



const navigation = [
  { name: "Dashboard", icon: BarChart3, href: "/admin" },
  { name: "Categories", icon: Box, href: "/admin/categories" },
  { name: "Products", icon: ShoppingBag, href: "/admin/products" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Sellers", icon: Store, href: "/admin/sellers" },
  { name: "Orders", icon: Truck, href: "/admin/orders" },
  { name: "Messages", icon: MessageSquare, href: "/admin/messages" },
  { name: "Tickets", icon: TicketIcon, href: "/admin/tickets" },
  { name: "Reviews", icon: Star, href: "/admin/reviews" },
];

export default function AdminSidebar({ isOpen, onToggle }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className={`font-bold text-xl ${!isOpen && "hidden"}`}>Admin</span>
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
                        ? "bg-p text-white"
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
