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
    variantTypes: selectedProduct.variantTypes.map(vType => ({
      id: `vtype-${Date.now()}-${Math.random()}`,
      name: vType.name || vType.variationName,
      values: vType.values || vType.variationValues
    })),
    variants: selectedProduct.variants.map(variant => ({
      id: variant.variantId,
      attributes: typeof variant.attributes === 'object' ? 
        variant.attributes : 
        variant.attributes[0],
      price: variant.price || variant.basePrice,
      stock: variant.stock
    })),
    useVariants: selectedProduct.variants && selectedProduct.variants.length > 0,
    tierPrices: selectedProduct.bulkDiscount.map(tier => ({
      id: tier._id || `tier-${Date.now()}-${Math.random()}`,
      minQuantity: tier.minQuantity || tier.minQty,
      price: tier.price || tier.priceDiscountPerUnit
    }))
  } : null;

  const handleSubmit = async (formData) => {
    const success = await onSubmit(formData);
    if (success) {
      // Only close dialog on successful submission
      setOpen(false);
    }
  };


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
          onSubmit={handleSubmit}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialogs;