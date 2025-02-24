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
import { Plus, Pen, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

const CategoryDialog = ({ type, category, allCategories, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "None",
    isActive: true,
  });

  useEffect(() => {
    if (type === "edit" && category) {
      setFormData({
        name: category.name || "",
        parentCategory: category.parentCategory || "None",
        isActive: category.isActive || false,
      });
    } else {
      setFormData({ name: "", parentCategory: "None", isActive: true });
    }
  }, [category, type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild><span>
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
        <DialogHeader>
          <DialogTitle>{type === "edit" ? "Edit Category" : "Create New Category"}</DialogTitle>
          <DialogDescription>
            {type === "edit" ? "Make changes to your category." : "Add a new category to your product catalog."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
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
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.parentCategory}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setFormData({ ...formData, parentCategory: "None" })}>
                    None
                  </DropdownMenuItem>
                  {allCategories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setFormData({ ...formData, parentCategory: cat.name })}>
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{type === "edit" ? "Save Changes" : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export  {CategoryDialog};
