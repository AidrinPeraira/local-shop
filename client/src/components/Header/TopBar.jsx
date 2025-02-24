import React from "react";
import { Twitter, Facebook, Youtube, Instagram, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const TopBar = () => {
  return (
    <div className="w-full bg-primary/5 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          <p className="text-sm text-gray-600">Welcome to LocalShop</p>

          <div className="flex items-center space-x-6">
            {/* Social Icons */}
            <div className="hidden md:flex items-center space-x-3">
              <a href="#" className="icon-button w-8 h-8 flex items-center justify-center">
                <Twitter size={16} />
              </a>
              <a href="#" className="icon-button w-8 h-8 flex items-center justify-center">
                <Facebook size={16} />
              </a>
              <a href="#" className="icon-button w-8 h-8 flex items-center justify-center">
                <Youtube size={16} />
              </a>
              <a href="#" className="icon-button w-8 h-8 flex items-center justify-center">
                <Instagram size={16} />
              </a>
            </div>

            {/* Language & Currency Selectors */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="flex items-center text-sm text-gray-600 hover:text-primary">
                  ENG
                  <ChevronDown size={16} className="ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Spanish</DropdownMenuItem>
                  <DropdownMenuItem>French</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="flex items-center text-sm text-gray-600 hover:text-primary">
                  USD
                  <ChevronDown size={16} className="ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>USD</DropdownMenuItem>
                  <DropdownMenuItem>EUR</DropdownMenuItem>
                  <DropdownMenuItem>GBP</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
