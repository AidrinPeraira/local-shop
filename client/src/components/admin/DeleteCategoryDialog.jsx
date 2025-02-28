import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "../../components/ui/alert-dialog";
  import { Button } from "../../components/ui/button";
  import { Trash } from "lucide-react";
  
  const DeleteCategoryDialog = ({ handleDelete, category }) => {
    return (
      <AlertDialog>
        <span onClick={(e) => e.stopPropagation()}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-red-600">
            <Trash className="h-4 w-4" />
          </Button>
          
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={()=>{
                handleDelete(category)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
          </span>
      </AlertDialog>
    );
  };
  
  export  {DeleteCategoryDialog};
  