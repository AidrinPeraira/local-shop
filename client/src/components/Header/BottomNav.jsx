import React from "react";
import {
  Menu,
  PackageSearch,
  ArrowLeftRight,
  Headphones,
  HelpCircle,
  Phone,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomNav = () => {
  const navigate = useNavigate();
  const { categories } = useSelector((store) => store.categories);

  const handleCategorySelect = (categoryId, categoryName) => {
    navigate(`/shop?category=${categoryId}&categoryName=${categoryName}`);
  };

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
              {categories.map((category) => (
                <DropdownMenuSub key={category._id}>
                  <DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {category.subCategories.map((subCategory) => (
                      <DropdownMenuSub key={subCategory._id}>
                        <DropdownMenuSubTrigger>
                          {subCategory.name}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {subCategory.subSubCategories.map((subSubCategory) => (
                            <DropdownMenuItem
                              key={subSubCategory._id}
                              onClick={() =>
                                handleCategorySelect(
                                  subSubCategory._id,
                                  subSubCategory.name
                                )
                              }
                            >
                              {subSubCategory.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
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
