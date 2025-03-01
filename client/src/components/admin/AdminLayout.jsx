
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

import {
  BarChart3,
  Box,
  Users,
  ShoppingBag,
  Computer,
  Store,
} from "lucide-react";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <AdminSidebar pages={navigation} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-6 mt">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
