import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import ProductForm from "./ProductForm";
import { useToast } from "../hooks/use-toast";

const ProductDialogs = ({ selectedProduct, isOpen, onOpenChange, onSubmit, categories }) => {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {selectedProduct ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          initialData={selectedProduct || {}}
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialogs;