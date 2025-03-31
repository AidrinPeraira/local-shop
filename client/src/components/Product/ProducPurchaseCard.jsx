import React, { useState, useEffect, useRef } from "react";
import { Check, ShieldCheck, Star, Package, Tag, Info } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "../../components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { addToCartAPI, processCartItemsAPI } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../redux/features/cartSlice";

const ProductPurchaseCard = ({ product }) => {

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [matchingVariant, setMatchingVariant] = useState(null);
  const [showAllVariants, setShowAllVariants] = useState(false);
  const [variantQuantities, setVariantQuantities] = useState({});
  const cardRef = useRef(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)

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

  // Initialize variant quantities
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const initialQuantities = {};
      product.variants.forEach((variant) => {
        initialQuantities[variant._id] = 0;
      });
      setVariantQuantities(initialQuantities);

      // Set default selected variant
      setSelectedVariant(product.variants[0].attributes[0]);
      setMatchingVariant(product.variants[0]);
    }
  }, [product.variants]);

  // Update selected variant details
  useEffect(() => {
    const match = findMatchingVariant();
    setMatchingVariant(match);
  }, [selectedVariant]);

  const handleVariantChange = (variationName, value) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [variationName]: value,
    }));
  };

  const handleVariantQuantityChange = (variantId, change) => {
    setVariantQuantities((prev) => {
      const variant = product.variants.find((v) => v._id === variantId);
      const currentQty = prev[variantId] || 0;
      const newQty = Math.max(0, Math.min(variant.stock, currentQty + change)); // to ensure we don't buy anything more than stock available

      return {
        ...prev,
        [variantId]: newQty,
      };
    });
  };

  const getTotalQuantity = () => {
    return Object.values(variantQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleAddToCart = async () => {
    // Get selected variants with quantities
    if(user.role !== 'buyer'){
      toast({
        title: "You are not logged in",
        description: "Please login as a buyer to add products to cart",
        variant: "destructive", 
      })
      return
    }
    const selectedVariants = Object.entries(variantQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([variantId, qty]) => {
        const variant = product.variants.find((v) => v._id === variantId);
        const variantDescription = Object.values(variant.attributes[0]).join(", ");
        return { variant : variant.variantId , qty, variantDescription };
      });


    if (selectedVariants.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one variant and quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await addToCartAPI({
        productId : product.id || product._id,
        variants : selectedVariants
      })

      toast({
        title: "Added to cart",
        description: `${response.data.message}`
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: `Error adding products to cart`,
        variant: "destructive"
      });

    }
    
  };

  const handleBuyNow =async () => {

    
    // Get selected variants with quantities
    const selectedVariants = Object.entries(variantQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([variantId, qty]) => {
        const variant = product.variants.find((v) => v._id === variantId);
        const variantDescription = Object.values(variant.attributes[0]).join(", ");
        return { variant : variant.variantId , qty, variantDescription };
      });


    if (selectedVariants.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one variant and quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await processCartItemsAPI({
        productId : product.id || product._id,
        variants : selectedVariants
      })


      dispatch(setCart(response.data.cart))
      navigate('/checkout')

      
      
    } catch (error) {
      console.log("buy now error", error)
      toast({
        title: "Error",
        description: `Error adding products to cart`,
        variant: "destructive"
      });

    }
    
  };

  // Find applicable bulk discount
  const getApplicableBulkDiscount = (qty) => {
    if (!product.bulkDiscount || product.bulkDiscount.length === 0) return 0;

    // Sort discounts by minQty in descending order
    const sortedDiscounts = [...product.bulkDiscount].sort(
      (a, b) => b.minQty - a.minQty
    );

    // Find the first discount that applies to the current quantity
    const applicableDiscount = sortedDiscounts.find(
      (discount) => qty >= discount.minQty
    );

    return applicableDiscount ? applicableDiscount.priceDiscountPerUnit : 0;
  };

  // Calculate price with discount for a specific variant
  const getDiscountedPrice = (basePrice, qty) => {
    const discountPerUnit = getApplicableBulkDiscount(qty);
    const discountAmount = (discountPerUnit / 100) * basePrice; // Convert percentage to amount
    return basePrice - discountAmount;
  };

  // Calculate total price for all selected variants
  const calculateTotalPrice = () => {
    let total = 0;

    Object.entries(variantQuantities).forEach(([variantId, qty]) => {
      if (qty > 0) {
        const variant = product.variants.find((v) => v._id === variantId);
        if (variant) {
          const discountedPrice = getDiscountedPrice(variant.basePrice, qty);
          total += discountedPrice * qty;
        }
      }
    });

    return total;
  };

  // Format a variant name from its attributes
  const formatVariantName = (attributes) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${value}`)
      .join(", ");
  };

  // Display current bulk discount for a quantity
  const getDiscountText = (qty) => {
    const discount = getApplicableBulkDiscount(qty);
    return discount > 0 ? `${discount}% off` : "No discount";
  };

  const totalPrice = calculateTotalPrice();
  const totalQuantity = getTotalQuantity();

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        {/* Header and main content section */}
        <div className="flex-grow space-y-4">
          <h1 className="text-2xl font-bold">{product.name || product.productName}</h1>
          <div className="mt-4 flex items-center">
            <span className="text-3xl font-bold text-gray-900">
              ₹{matchingVariant?.basePrice.toFixed(2)}
            </span>
          </div>

          {/* stock status */}
          <div className="mb-6 flex items-center">
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

          {/* Variant Selection Table */}
          <Accordion type="single" collapsible className="border rounded-md">
            <AccordionItem value="variants">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    Available Variants & Quantities
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {getTotalQuantity()} selected
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variant</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variants.map((variant) => {
                        const variantName = formatVariantName(
                          variant.attributes[0]
                        );
                        const qty = variantQuantities[variant._id] || 0;
                        const basePrice = variant.basePrice;
                        const discountedPrice = getDiscountedPrice(
                          basePrice,
                          qty
                        );
                        const discount = getApplicableBulkDiscount(qty);
                        const hasDiscount = discount > 0;

                        return (
                          <TableRow key={variant._id}>
                            <TableCell className="font-medium">
                              {variantName}
                            </TableCell>
                            <TableCell>₹{basePrice.toFixed(2)}</TableCell>
                            <TableCell>
                              {variant.stock} {product.stockUnit}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleVariantQuantityChange(variant._id, -1)
                                  }
                                  className="px-2 py-1 border rounded-md text-xs"
                                  disabled={qty <= 0}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={qty}
                                  onChange={(e) => {
                                    const newQty =
                                      parseInt(e.target.value) || 0;
                                    const clampedQty = Math.max(
                                      0,
                                      Math.min(variant.stock, newQty)
                                    );
                                    setVariantQuantities((prev) => ({
                                      ...prev,
                                      [variant._id]: clampedQty,
                                    }));
                                  }}
                                  className="w-12 text-center text-sm border rounded-md py-1 px-1"
                                  min="0"
                                  max={variant.stock}
                                />
                                <button
                                  onClick={() =>
                                    handleVariantQuantityChange(variant._id, 1)
                                  }
                                  className="px-2 py-1 border rounded-md text-xs"
                                  disabled={qty >= variant.stock}
                                >
                                  +
                                </button>
                              </div>
                            </TableCell>
                            <TableCell>
                              {hasDiscount ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200">
                                  {discount}% off
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {qty > 0
                                ? `₹${(discountedPrice * qty).toFixed(2)}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Bulk Discount Information */}
          {product.bulkDiscount && product.bulkDiscount.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <h3 className="font-medium text-gray-900 mb-1.5 flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-primary" />
                Bulk Discounts
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 ml-1.5 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Discounts are applied per variant based on the quantity
                        ordered for each variant.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
        </div>

        {/* Bottom buttons section - clear separation */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Total Quantity:</span>
            <span className="text-lg font-medium">
              {totalQuantity} {product.stockUnit}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total Price:</span>
            <span className="text-xl font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="w-full"
              disabled={totalQuantity === 0}
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              className="w-full"
              disabled={totalQuantity === 0}
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
