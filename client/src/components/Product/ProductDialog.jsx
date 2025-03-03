import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import ProductForm from "./ProductForm";
import { useToast } from "../hooks/use-toast";

// Mock categories
const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "home", name: "Home & Kitchen" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "toys", name: "Toys & Games" },
];

const ProductDialogs = ({
  product,
  isOpen,
  onOpenChange,
  onProductAction,
}) => {
  const { toast } = useToast();

  const handleCreateProduct = (data) => {
    onProductAction("create", data);
    onOpenChange("create", false);
    toast({
      title: "Product Created",
      description: `${data.name} has been created successfully.`,
    });
  };

  const handleUpdateProduct = (data) => {
    onProductAction("update", data);
    onOpenChange("edit", false);
    toast({
      title: "Product Updated",
      description: `${data.name} has been updated successfully.`,
    });
  };

  const handleDeleteProduct = () => {
    if (product) {
      onProductAction("delete", product);
      onOpenChange("delete", false);
      toast({
        title: "Product Deleted",
        description: `${product.name} has been deleted successfully.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Create Product Dialog */}
      <Dialog 
        open={isOpen.create} 
        onOpenChange={(open) => onOpenChange("create", open)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleCreateProduct} 
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog 
        open={isOpen.edit} 
        onOpenChange={(open) => onOpenChange("edit", open)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {product && (
            <ProductForm 
              initialData={{
                id: product.id,
                name: product.name,
                description: product.description || "",
                category: product.category || "",
                basePrice: product.basePrice || parseFloat(product.price.replace("$", "")),
                stock: product.stock,
                images: product.images || [],
                variants: product.variants || [],
                tierPrices: product.tierPrices || [],
                isDeleted: product.isDeleted || false,
              }} 
              onSubmit={handleUpdateProduct} 
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <AlertDialog 
        open={isOpen.delete} 
        onOpenChange={(open) => onOpenChange("delete", open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the product "{product?.name}". The product will be hidden from customers but can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDialogs;