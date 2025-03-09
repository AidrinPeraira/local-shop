import React, { useState, useEffect, useRef } from 'react';
import { Check, ShieldCheck, Star, Package, Tag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from '../../components/ui/use-toast';



const ProductPurchaseCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const cardRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update selected variant when color or size changes
  useEffect(() => {
    const variant = product.variants.find(v => 
      v.attributes[0]?.Color === selectedColor && 
      v.attributes[0]?.Size === selectedSize
    );
    setSelectedVariant(variant || null);
  }, [selectedColor, selectedSize, product.variants]);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} (${selectedColor}, ${selectedSize})`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Proceeding to checkout",
      description: `${quantity} × ${product.name} (${selectedColor}, ${selectedSize})`,
    });
  };

  // Find applicable bulk discount
  const getApplicableBulkDiscount = () => {
    if (!product.bulkDiscount || product.bulkDiscount.length === 0) return 0;
    
    // Sort discounts by minQty in descending order
    const sortedDiscounts = [...product.bulkDiscount].sort((a, b) => b.minQty - a.minQty);
    
    // Find the first discount that applies to the current quantity
    const applicableDiscount = sortedDiscounts.find(discount => quantity >= discount.minQty);
    
    return applicableDiscount ? applicableDiscount.priceDiscountPerUnit : 0;
  };

  // Calculate price with discount
  const getDiscountedPrice = () => {
    const basePrice = selectedVariant?.basePrice || product.price;
    const discountPerUnit = getApplicableBulkDiscount();
    const discountAmount = (discountPerUnit / 100) * basePrice; // Convert percentage to amount
    return basePrice - discountAmount;
  };

  const discountedPrice = getDiscountedPrice();
  const totalPrice = discountedPrice * quantity + (expressDelivery ? 200 : 0);
  const hasDiscount = getApplicableBulkDiscount() > 0;
  const discount = getApplicableBulkDiscount();
  const savePercentage = ((discount / product.price) * 100).toFixed(0);

  // Simplified card classes
  const cardClasses = "bg-white rounded-lg shadow-md p-6 h-full";

  // Check if current variant is in stock
  const isVariantInStock = selectedVariant ? selectedVariant.inStock && selectedVariant.stock > 0 : product.inStock;

  return (
    <div ref={cardRef} className={cardClasses}>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          
          {/* Pricing Section */}
          <div className="mt-4 flex items-center">
            <span className="text-3xl font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="ml-3 text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  {savePercentage}% OFF
                </Badge>
              </>
            )}
          </div>
          
          {/* Rating */}
          <div className="mt-3 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>
          
          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded-full ${
                      color === selectedColor
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      size === selectedSize
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Stock Information */}
          <div className="mb-6 flex items-center">
            <Package className="w-4 h-4 mr-2 text-gray-500" />
            <span className={`text-sm ${isVariantInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isVariantInStock 
                ? `In Stock (${selectedVariant?.stock || product.stock} available)` 
                : 'Out of Stock'}
            </span>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 border rounded-l flex items-center justify-center bg-gray-50 text-gray-600 disabled:opacity-50"
              >
                -
              </button>
              <div className="w-14 h-10 border-t border-b flex items-center justify-center text-gray-800">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={!isVariantInStock || (selectedVariant && quantity >= selectedVariant.stock)}
                className="w-10 h-10 border rounded-r flex items-center justify-center bg-gray-50 text-gray-600 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Bulk Discount Information */}
          {product.bulkDiscount && product.bulkDiscount.length > 0 && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-primary" />
                Bulk Discounts
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {product.bulkDiscount
                  .filter(d => d.priceDiscountPerUnit > 0)
                  .sort((a, b) => a.minQty - b.minQty)
                  .map((discount) => (
                    <li key={discount._id} className="flex justify-between">
                      <span>{discount.minQty}+ units:</span>
                      <span className="font-medium">{discount.priceDiscountPerUnit}% off per unit</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
          
          {/* Express Delivery Option */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="express"
                checked={expressDelivery}
                onCheckedChange={(checked) => 
                  setExpressDelivery(checked)
                }
              />
              <div>
                <label htmlFor="express" className="text-sm font-medium cursor-pointer">
                  Express Delivery (+₹200)
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Get your order delivered within 24 hours
                </p>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-800">
                Money Back Guarantee • Free Returns
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom buttons section - now part of flex layout */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
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
