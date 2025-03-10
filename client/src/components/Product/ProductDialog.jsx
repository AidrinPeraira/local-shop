import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import ProductForm from "./ProductForm";

const ProductDialogs = ({ selectedProduct, isOpen, onOpenChange, onSubmit, categories }) => {
  

  //make initial data object to match the layout of the form.
  const initialData = selectedProduct ? {
    id: selectedProduct._id,
    name: selectedProduct.productName,
    description: selectedProduct.description,
    category: selectedProduct.category,
    basePrice: selectedProduct.basePrice, 
    stock: selectedProduct.stock,
    images: selectedProduct.images.map((url, index) => ({
      id: `existing-${index}`,
      url: url,
      order: index,
      isExisting: true 
    })),
    variants: selectedProduct.variants.map(variant => ({
      id: variant.variantId,
      attributes: variant.attributes[0], 
      price: variant.basePrice , 
      stock: variant.stock
    })),
    tierPrices: selectedProduct.bulkDiscount.map(tier => ({
      id: tier._id, 
      minQuantity: tier.minQty,
      price: tier.priceDiscountPerUnit
    }))
  } : null;

  console

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
          initialData={initialData || {}}
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