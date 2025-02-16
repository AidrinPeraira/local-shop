
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import SellerHeader from "./SellerHeader";

export  function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-admin">
      <SellerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <SellerHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
