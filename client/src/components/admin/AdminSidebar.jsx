
import { NavLink } from "react-router-dom";


export default function AdminSidebar({ isOpen, onToggle, pages }) {
  const navigation = pages
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b border-gray-200" onClick={onToggle}>
          <span className={`font-bold text-xl ${!isOpen && "hidden"}`}>Admin</span>
          <span className={`font-bold text-xl ${isOpen && "hidden"}`}>A</span>
          
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === "/admin"} //to prevetnt dashboard from beign always active
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-accent text-primary"
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
