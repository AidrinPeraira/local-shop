import React from "react";
import { Menu, PackageSearch, ArrowLeftRight, Headphones, HelpCircle, Phone, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {

  const navigate = useNavigate()

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <Menu className="mr-2 h-4 w-4" />
                All Categories
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>Electronics</DropdownMenuItem>
              <DropdownMenuItem>Clothing</DropdownMenuItem>
              <DropdownMenuItem>Home & Garden</DropdownMenuItem>
              <DropdownMenuItem>Sports</DropdownMenuItem>
              <DropdownMenuItem>Books</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="nav-item">
              <PackageSearch size={20} />
              Track Order
            </a>
          
            <a href="#" className="nav-item">
              <Headphones size={20} />
              Support
            </a>
            <a href="#" className="nav-item">
              <HelpCircle size={20} />
              Help
            </a>
          </div>

          {/* Contact */}
          <div className="hidden lg:flex items-center text-gray-700">
            <Phone size={20} className="mr-2 text-primary" />
            <span className="font-medium">+91 9400 40 9843</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
