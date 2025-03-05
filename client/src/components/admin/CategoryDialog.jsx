import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus, Pen, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

const CategoryDialog = ({ type, category, allCategories, submitAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    parentCategoryName: "None",
    parentCategory: null,
  });

  useEffect(() => {
    if (type === "edit" && category) {
      setFormData({
        name: category.name || "",
        parentCategoryName: category.parentCategoryName || "None",
        parentCategory: category.parentCategory || null,
        isActive: category.isActive,
      });
    } else {
      setFormData({
        name: "",
        parentCategoryName: "None",
        parentCategory: null,
        isActive: true,
      });
    }
  }, [category, type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (name, id) => {
    setFormData({ ...formData, parentCategoryName: name, parentCategory: id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let submissionSuccess = submitAction({ ...formData, _id : category._id });
    if (submissionSuccess) setIsModalOpen(!isModalOpen);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <span onClick={(e) => e.stopPropagation()}>
          {type === "edit" ? (
            <Button variant="ghost" size="icon">
              <Pen className="h-4 w-4" />
            </Button>
          ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden md:inline"> Create New Category</span>
            </Button>
          )}
        </span>
      </DialogTrigger>
      <DialogContent>
        <span onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              {type === "edit" ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {type === "edit"
                ? "Make changes to your category."
                : "Add a new category to your product catalog."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Category name*/}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Selecting the parent */}
              <div className="space-y-2">
                <Label htmlFor="parentCategoryName">Parent Category</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {formData.parentCategoryName}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-80 overflow-y-auto">
                    <DropdownMenuItem
                      onClick={() => handleCategorySelect("None", null)}
                    >
                      None
                    </DropdownMenuItem>
                    {allCategories
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((cat) => (
                        <div key={cat._id}>
                          {/* Level 1 Categories */}
                          <DropdownMenuItem
                            onClick={() =>
                              handleCategorySelect(cat.name, cat._id)
                            }
                          >
                            {cat.name}
                          </DropdownMenuItem>

                          {/* Level 2 Categories (subCategories) */}
                          {cat.subCategories &&
                            cat.subCategories.length > 0 && (
                              <div className="pl-4">
                                {cat.subCategories
                                  .slice()
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((subCat) => (
                                    <div key={subCat._id}>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCategorySelect(
                                            subCat.name,
                                            subCat._id
                                          )
                                        }
                                      >
                                        {subCat.name}
                                      </DropdownMenuItem>

                                      {/* Level 3 Categories (subSubCategories) */}
                                      {subCat.subSubCategories &&
                                        subCat.subSubCategories.length > 0 && (
                                          <div className="pl-4">
                                            {subCat.subSubCategories
                                              .slice()
                                              .sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                              )
                                              .map((subSubCat) => (
                                                <DropdownMenuItem
                                                  key={subSubCat._id}
                                                  onClick={() =>
                                                    handleCategorySelect(
                                                      subSubCat.name,
                                                      subSubCat._id
                                                    )
                                                  }
                                                >
                                                  {subSubCat.name}
                                                </DropdownMenuItem>
                                              ))}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Category Active Status Switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isActive: checked,
                    })
                  }
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <span>
                <Button type="submit">
                  {type === "edit" ? "Save Changes" : "Create Category"}
                </Button>
              </span>
            </DialogFooter>
          </form>
        </span>
      </DialogContent>
    </Dialog>
  );
};

export { CategoryDialog };
