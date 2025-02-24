import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Clock,
  Plus,
  Search,
  Trash,
  Pen,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { useToast } from "../../components/hooks/use-toast";
import { CategoryDialog } from "../../components/admin/CategoryDialog";
import { DeleteCategoryDialog } from "../../components/admin/DeleteCategoryDialog";

// Enhanced mock data with three levels
const allCategories = [
  {
    id: 1,
    name: "Electronics",
    parentCategory: null,
    isActive: true,
    productsCount: 450,
    subcategories: [
      {
        id: 4,
        name: "Smartphones & Tablets",
        parentCategory: "Electronics",
        isActive: true,
        productsCount: 145,
        subcategories: [
          {
            id: 10,
            name: "Android Phones",
            parentCategory: "Smartphones & Tablets",
            isActive: true,
            productsCount: 85,
          },
          {
            id: 11,
            name: "iPhones",
            parentCategory: "Smartphones & Tablets",
            isActive: true,
            productsCount: 35,
          },
          {
            id: 12,
            name: "Tablets",
            parentCategory: "Smartphones & Tablets",
            isActive: true,
            productsCount: 25,
          },
        ],
      },
      {
        id: 5,
        name: "Computers",
        parentCategory: "Electronics",
        isActive: true,
        productsCount: 230,
        subcategories: [
          {
            id: 13,
            name: "Laptops",
            parentCategory: "Computers",
            isActive: true,
            productsCount: 120,
          },
          {
            id: 14,
            name: "Desktop PCs",
            parentCategory: "Computers",
            isActive: true,
            productsCount: 80,
          },
          {
            id: 15,
            name: "Computer Accessories",
            parentCategory: "Computers",
            isActive: false,
            productsCount: 30,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Fashion",
    parentCategory: null,
    isActive: true,
    productsCount: 350,
    subcategories: [
      {
        id: 6,
        name: "Men's Fashion",
        parentCategory: "Fashion",
        isActive: true,
        productsCount: 180,
        subcategories: [
          {
            id: 16,
            name: "Formal Wear",
            parentCategory: "Men's Fashion",
            isActive: true,
            productsCount: 60,
          },
          {
            id: 17,
            name: "Casual Wear",
            parentCategory: "Men's Fashion",
            isActive: true,
            productsCount: 90,
          },
        ],
      },
      {
        id: 7,
        name: "Women's Fashion",
        parentCategory: "Fashion",
        isActive: true,
        productsCount: 170,
        subcategories: [
          {
            id: 18,
            name: "Dresses",
            parentCategory: "Women's Fashion",
            isActive: true,
            productsCount: 75,
          },
          {
            id: 19,
            name: "Accessories",
            parentCategory: "Women's Fashion",
            isActive: false,
            productsCount: 95,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Home & Living",
    parentCategory: null,
    isActive: false,
    productsCount: 275,
    subcategories: [
      {
        id: 8,
        name: "Furniture",
        parentCategory: "Home & Living",
        isActive: false,
        productsCount: 150,
        subcategories: [
          {
            id: 20,
            name: "Living Room",
            parentCategory: "Furniture",
            isActive: false,
            productsCount: 50,
          },
          {
            id: 21,
            name: "Bedroom",
            parentCategory: "Furniture",
            isActive: false,
            productsCount: 100,
          },
        ],
      },
    ],
  },
];

export default function Categories() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toast = useToast();

  const handleCreate = (e) => {
    e.preventDefault();
    setIsCreateModalOpen(false);
    toast.success("Category created successfully");
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    toast.success("Category updated successfully");
  };

  const handleDelete = () => {
    toast.success("Category deleted successfully");
  };

  const filteredCategories = allCategories.filter((category) => {
    if (selectedStatus !== "all") {
      return category.isActive === (selectedStatus === "active");
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Categories</h1>

        {/* Modal component to add news categories. This is made using dialouge. not modal.*/}
        <CategoryDialog allCategories={allCategories} handleCreate={handleCreate}/>
        {/* add props for data and handle function */}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Status Filter */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Status</h2>
          <div className="flex gap-2">
            {["all", "active", "inactive"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </Card>

        {/* Parent Category Filter */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Parent Category</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                All Categories
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>All Categories</DropdownMenuItem>
              {allCategories.map((category) => (
                <DropdownMenuItem key={category.id}>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>

        {/* Sort By */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Sort By</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span>
                <Button variant="outline" className="w-full justify-between">
                  {sortBy === "latest" && (
                    <>
                      Latest <Clock className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {sortBy === "az" && (
                    <>
                      A-Z <ArrowDownAZ className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {sortBy === "most-used" && (
                    <>
                      Most Used <ArrowUpAZ className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("latest")}>
                <Clock className="mr-2 h-4 w-4" /> Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("az")}>
                <ArrowDownAZ className="mr-2 h-4 w-4" /> A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("most-used")}>
                <ArrowUpAZ className="mr-2 h-4 w-4" /> Most Used
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>

        {/* Search */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Search</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>
      </div>

      {/* Categories Accordion */}
      <Card className="p-4">
        <Accordion type="single" collapsible className="space-y-4">
          {filteredCategories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id.toString()}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      #{category.id}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {category.productsCount} Products
                    </span>
                    <div className="flex items-center gap-2">

                        {/* modal/ pop up to edit and dlete */}
                        <CategoryDialog type='edit' category={selectedCategory} allCategories={allCategories} handleCreate={handleCreate}/>
                      <DeleteCategoryDialog/>
                      
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {category.subcategories.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <AccordionItem
                        key={subcategory.id}
                        value={subcategory.id.toString()}
                        className="border rounded-md px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-3 ">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-4">
                              {/* categoty number goes herer */}
                              <span className="text-sm text-muted-foreground">
                                #{subcategory.id}
                              </span>
                              {/* category name goes here */}
                              <span className="font-medium">
                                {subcategory.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-6">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  subcategory.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {subcategory.isActive ? "Active" : "Inactive"}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {subcategory.productsCount} Products
                              </span>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Pen className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {subcategory.subcategories?.length > 0 ? (
                            <div className="space-y-2 py-2">
                              {subcategory.subcategories.map(
                                (subSubCategory) => (
                                  <div
                                    key={subSubCategory.id}
                                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                                  >
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm text-muted-foreground">
                                        #{subSubCategory.id}
                                      </span>
                                      <span className="font-medium">
                                        {subSubCategory.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          subSubCategory.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {subSubCategory.isActive
                                          ? "Active"
                                          : "Inactive"}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {subSubCategory.productsCount} Products
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                          <Pen className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-red-600"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground py-2">
                              No sub-subcategories found
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    No subcategories found
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-primary text-primary-foreground"
        >
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
