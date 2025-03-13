import React, { useState, useEffect, useRef } from "react";
import { Check, ShieldCheck, Star, Package, Tag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "../../components/ui/use-toast";

const ProductPurchaseCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [matchingVariant, setMatchingVariant] = useState(null);
  const cardRef = useRef(null);

  // Find matching variant for price and stock count
  const findMatchingVariant = () => {
    if (!selectedVariant) return null;
    const matchingVariant = product.variants.find((value) => {
      let variations = Object.entries(value.attributes[0]);
      let selected = Object.entries(selectedVariant);
      
      return JSON.stringify(variations) === JSON.stringify(selected);
    });
    return matchingVariant;
  };

  // Update selected variant details
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].attributes[0]);
      setMatchingVariant(findMatchingVariant());
    }
  }, [product.variants]);

  const handleVariantChange = (variationName, value) => {
    setSelectedVariant(prev => ({
      ...prev,
      [variationName]: value
    }));
    // Find matching variant after state update using callback
    setTimeout(() => {
      setMatchingVariant(findMatchingVariant());
    }, 0);
  };

  const handleAddToCart = () => {
    // Construct variant description string
    const variantDesc = Object.values(selectedVariant).join(', ');
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} (${variantDesc})`,
    });
  };

  const handleBuyNow = () => {
    // Construct variant description string
    const variantDesc = Object.values(selectedVariant).join(', ');
    
    toast({
      title: "Proceeding to checkout",
      description: `${quantity} × ${product.name} (${variantDesc})`,
    });
  };

  // Find applicable bulk discount
  const getApplicableBulkDiscount = () => {
    if (!product.bulkDiscount || product.bulkDiscount.length === 0) return 0;

    // Sort discounts by minQty in descending order
    const sortedDiscounts = [...product.bulkDiscount].sort(
      (a, b) => b.minQty - a.minQty
    );

    // Find the first discount that applies to the current quantity
    const applicableDiscount = sortedDiscounts.find(
      (discount) => quantity >= discount.minQty
    );

    return applicableDiscount ? applicableDiscount.priceDiscountPerUnit : 0;
  };

  // Calculate price with discount
  const getDiscountedPrice = () => {
    const basePrice = matchingVariant?.basePrice || product.price;
    const discountPerUnit = getApplicableBulkDiscount();
    const discountAmount = (discountPerUnit / 100) * basePrice; // Convert percentage to amount
    return basePrice - discountAmount;
  };

  const discountedPrice = getDiscountedPrice();
  const totalPrice = discountedPrice * quantity;
  const hasDiscount = getApplicableBulkDiscount() > 0;
  const discount = getApplicableBulkDiscount();
  const savePercentage = matchingVariant ? 
    ((discount / matchingVariant.basePrice) * 100).toFixed(0) : 
    ((discount / product.price) * 100).toFixed(0);

  // Check if current variant is in stock
  const isVariantInStock = matchingVariant ? 
    matchingVariant.stock > 0 : 
    product.inStock;

  return (
    <div 
      ref={cardRef} 
      className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        {/* Header and main content section */}
        <div className="flex-grow space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {/* Pricing Section */}
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && matchingVariant && (
              <>
                <span className="ml-3 text-lg text-gray-500 line-through">
                  ₹{matchingVariant.basePrice.toFixed(2)}
                </span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-50 text-green-700 border-green-200"
                >
                  {savePercentage}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Variants Data - Compact layout */}
          {product.variantTypes?.map((variantType) => (
            <div key={variantType._id} className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {variantType.variationName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {variantType.variationValues?.map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      handleVariantChange(variantType.variationName, value)
                    }
                    className={`px-3 py-1.5 border rounded-md text-sm ${
                      selectedVariant[variantType.variationName] === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Stock Status */}
          <div className="flex items-center">
            <Package className="w-4 h-4 mr-2 text-gray-500" />
            {matchingVariant ? (
              <span
                className={`text-sm ${
                  matchingVariant.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {matchingVariant.stock > 0
                  ? `In Stock (${matchingVariant.stock} ${product.stockUnit} available)`
                  : "Out of Stock"}
              </span>
            ) : (
              <span className="text-sm text-yellow-600">
                Please select all variants
              </span>
            )}
          </div>

          {/* Bulk Discount Information - More compact */}
          {product.bulkDiscount && product.bulkDiscount.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <h3 className="font-medium text-gray-900 mb-1.5 flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-primary" />
                Bulk Discounts
              </h3>
              <ul className="space-y-0.5 text-gray-600">
                {product.bulkDiscount
                  .filter((d) => d.priceDiscountPerUnit > 0)
                  .sort((a, b) => a.minQty - b.minQty)
                  .map((discount) => (
                    <li key={discount._id} className="flex justify-between">
                      <span>{discount.minQty}+ units:</span>
                      <span className="font-medium">
                        {discount.priceDiscountPerUnit}% off per unit
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Quantity and Units */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Quantity ({product.stockUnit})
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-md"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded-md"
                disabled={matchingVariant && quantity >= matchingVariant.stock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Bottom buttons section - clear separation */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-xl font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="w-full"
              disabled={!isVariantInStock}
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              className="w-full"
              disabled={!isVariantInStock}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPurchaseCard;