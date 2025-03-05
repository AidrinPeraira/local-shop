import { useCallback, useEffect, useState } from "react";
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
import { useToast } from "../../components/hooks/use-toast";
import { CategoryDialog } from "../../components/admin/CategoryDialog";
import { DeleteCategoryDialog } from "../../components/admin/DeleteCategoryDialog";
import {
  createNewCategoryAPI,
  deleteCurrentCategoryAPI,
  editCurrentCategoryAPI,
  getAllCategoriesAPI,
} from "../../api/categoryApi";
// Enhanced mock data with three levels

export default function Categories() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("az");
  const { toast } = useToast();
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState("All Categories");

  //get all categories form the sever
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getAllCategoriesAPI();
      setAllCategories(response.data);
    } catch (error) {
      console.log("FetchingCategories: ",error);
      toast({
        title: "Error!",
        description: "Error fetching Categories!",
        variant: "destructive",
      });
    }
  });
  useEffect(() => {
    fetchCategories();
  }, []);

  //to reset filters when all categoties are changed
  useEffect(() => {
    setFilteredCategories(allCategories);
  }, [allCategories]);

  // filtering the categories
  useEffect(() => {
    let filtered = [...allCategories];

    // isActive
    if (activeFilter !== "all") {
      filtered = filtered.filter((category) =>
        activeFilter === "active" ? category.isActive : !category.isActive
      );
    }

    // level 1 parent
    if (selectedParentCategory !== "All Categories") {
      filtered = filtered.filter((category) => {
        if (category.name === selectedParentCategory) return true;
        const isChild =
          category.parentCategory &&
          allCategories.find((c) => c._id === category.parentCategory)?.name ===
            selectedParentCategory;
        return isChild;
      });
    }

    // search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(query)
      );
    }

    ///applying the filters
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.name.localeCompare(b.name);
        case "za":
          return b.name.localeCompare(a.name);
        case "latest":
          return b.createdAt.localeCompare(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredCategories(filtered);
  }, [
    allCategories,
    activeFilter,
    selectedParentCategory,
    searchQuery,
    sortBy,
  ]);

  //actions to be done
  const handleCreate = useCallback(async (newCategory) => {
    try {
      const response = await createNewCategoryAPI({
        name: newCategory.name,
        parentCategory: newCategory.parentCategory, // Ensure this is the correct ID
      });
      fetchCategories();
      toast({
        title: "Success!",
        description: response.data.message,
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error("Create Category Error: ", error.response.data.message);
      toast({
        title: "Error!",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const handleEdit = useCallback(async (edittedCategory) => {
    try {
      const response = await editCurrentCategoryAPI({
        ...edittedCategory,
      });
      fetchCategories();
      toast({
        title: "Success!",
        description: response.data.message,
        variant: "default",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error!",
        description: error.response.data.message,
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const handleDelete = useCallback(async (deleteCategory) => {
    try {
      const response = await deleteCurrentCategoryAPI(deleteCategory);
      fetchCategories();
      toast({
        title: "Success!",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Success!",
        description: error.response.data.message,
        variant: "default",
      });
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Categories</h1>

        {/* Modal component to add news categories. This is made using dialouge. not modal.*/}
        <CategoryDialog
          allCategories={allCategories}
          submitAction={handleCreate}
        />
        {/* add props for data and handle function */}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Status Filter */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Status</h2>
          <div className="flex gap-2">
            {["all", "active", "inactive"].map((status) => (
              <Button
                key={status}
                variant={activeFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(status)}
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
                {selectedParentCategory}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => setSelectedParentCategory("All Categories")}
              >
                All Categories
              </DropdownMenuItem>
              {allCategories
                .filter((category) => !category.parentCategory) // Only show top-level categories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <DropdownMenuItem
                    key={category._id}
                    onClick={() => setSelectedParentCategory(category.name)}
                  >
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
                  {sortBy === "az" && (
                    <>
                      A-Z <ArrowDownAZ className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {sortBy === "za" && (
                    <>
                      Z-A <ArrowUpAZ className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {sortBy === "latest" && (
                    <>
                      Latest <Clock className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("az")}>
                <ArrowDownAZ className="mr-2 h-4 w-4" /> A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("za")}>
                <ArrowUpAZ className="mr-2 h-4 w-4" /> Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("latest")}>
                <Clock className="mr-2 h-4 w-4" /> Latest
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
          {filteredCategories
            .slice()
            // .sort((a, b) => a.name.localeCompare(b.name))
            .map((category, index) => (
              <AccordionItem
                key={category._id}
                value={category._id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        #{index + 1}
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
                        Level {category.level}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* modal/ pop up to edit and dlete category this is the pen icon now*/}
                        <CategoryDialog
                          type="edit"
                          category={{
                            name: category.name,
                            parentCategory: category.parentCategory || null,
                            isActive: category.isActive,
                            _id: category._id,
                          }}
                          allCategories={allCategories}
                          submitAction={handleEdit}
                        />

                        <DeleteCategoryDialog
                          handleDelete={handleDelete}
                          category={category}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* accordion for sub categories */}
                <AccordionContent>
                  {category.subCategories.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.subCategories.map((subcategory, index) => (
                        <AccordionItem
                          key={subcategory._id}
                          value={subcategory._id}
                          className="border rounded-md px-4"
                        >
                          <AccordionTrigger className="hover:no-underline py-3 ">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-4">
                                {/* categoty number goes herer */}
                                <span className="text-sm text-muted-foreground">
                                  #{index + 1}
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
                                  Level {subcategory.level}
                                </span>
                                <div className="flex items-center gap-2">
                                  <CategoryDialog
                                    type="edit"
                                    category={{
                                      name: subcategory.name,
                                      parentCategory:
                                        subcategory.parentCategory,
                                      parentCategoryName: category.name,
                                      isActive: subcategory.isActive,
                                      _id: subcategory._id,
                                    }}
                                    allCategories={allCategories}
                                    submitAction={handleEdit}
                                  />

                                  <DeleteCategoryDialog
                                    handleDelete={handleDelete}
                                    category={subcategory}
                                  />
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {subcategory.subSubCategories?.length > 0 ? (
                              <div className="space-y-2 py-2">
                                {subcategory.subSubCategories.map(
                                  (subSubCategory, index) => (
                                    <div
                                      key={subSubCategory._id}
                                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                                    >
                                      <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">
                                          #{index + 1}
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
                                          Level {subSubCategory.level}
                                        </span>

                                        {/* editting and deleting sub sub categories */}
                                        <div className="flex items-center gap-2">
                                          <CategoryDialog
                                            type="edit"
                                            category={{
                                              name: subSubCategory.name,
                                              parentCategory:
                                                subSubCategory.parentCategory,
                                              parentCategoryName:
                                                subcategory.name,
                                              isActive: subSubCategory.isActive,
                                              _id: subSubCategory._id,
                                            }}
                                            allCategories={allCategories}
                                            submitAction={handleEdit}
                                          />

                                          <DeleteCategoryDialog
                                            handleDelete={handleDelete}
                                            category={subSubCategory}
                                          />
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

      {/* Pagination to be added*/}
      {/* <div className="flex items-center justify-center space-x-2">
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
      </div> */}
    </div>
  );
}
