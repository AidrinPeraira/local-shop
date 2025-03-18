import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../components/hooks/use-toast";
import { getCartItemsAPI, updateCartAPI } from "../../api/cartApi";
import { PageLoading } from "../ui/PageLoading";

const CartContent = () => {
  const [cartData, setCartData] = useState(null);
  const [localCartData, setLocalCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    if (cartData && !localCartData) {
      setLocalCartData(JSON.parse(JSON.stringify(cartData)));
    }
  }, [cartData]);

  const fetchCartData = async () => {
    try {
      const response = await getCartItemsAPI();
      if (response.data.success) {
        setCartData(response.data.cart);
      } else {
        throw new Error("Failed to fetch cart data");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch cart data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLocalQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) return;

    setLocalCartData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const productIndex = newData.items.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex === -1) return prevData;

      const item = newData.items[productIndex];
      const variantIndex = item.variants.findIndex(
        (v) => v.variantId === variantId
      );

      if (variantIndex === -1) return prevData;

      const variant = item.variants[variantIndex];
      variant.quantity = newQuantity;

      // Calculate new variantTotal
      variant.variantTotal = variant.basePrice * newQuantity;

      // Calculate bulk discount if applicable
      let discountPerUnit = 0;
      if (item.bulkDiscount && item.bulkDiscount.length > 0) {
        // Total quantity of all variants for this product
        const totalProductQuantity = item.variants.reduce(
          (sum, v) => sum + v.quantity,
          0
        );

        // Find the applicable discount tier
        const applicableDiscount = item.bulkDiscount
          .filter((discount) => totalProductQuantity >= discount.minQty)
          .sort((a, b) => b.minQty - a.minQty)[0];

        discountPerUnit = applicableDiscount
          ? applicableDiscount.priceDiscountPerUnit
          : 0;
      }

      // Update product totals
      item.totalQuantity = item.variants.reduce(
        (sum, v) => sum + v.quantity,
        0
      );

      item.productSubtotal = item.variants.reduce(
        (sum, v) => sum + v.variantTotal,
        0
      );

      if (discountPerUnit > 0) {
        item.productDiscount = item.totalQuantity * discountPerUnit;
        item.productTotal = item.productSubtotal - item.productDiscount;
      } else {
        item.productDiscount = 0;
        item.productTotal = item.productSubtotal;
      }

      // Update summary
      newData.summary.subtotalBeforeDiscount = newData.items.reduce(
        (sum, item) => sum + item.productSubtotal,
        0
      );

      newData.summary.totalDiscount = newData.items.reduce(
        (sum, item) => sum + item.productDiscount,
        0
      );

      newData.summary.subtotalAfterDiscount =
        newData.summary.subtotalBeforeDiscount - newData.summary.totalDiscount;

      newData.summary.cartTotal =
        newData.summary.subtotalAfterDiscount +
        newData.summary.shippingCharge +
        newData.summary.platformFee;

      return newData;
    });
  };

  const updateCart = async () => {
    try {
      const updates = localCartData.items.flatMap(item =>
        item.variants.map(variant => ({
          productId: item.productId,
          variantId: variant.variantId,
          quantity: variant.quantity,
          attributes: variant.attributes,
        }))
      );

      const response = await updateCartAPI({ variants: updates });
      
      if (response.data.success) {
        const freshCartData = await getCartItemsAPI();
        if (freshCartData.data.success) {
          setCartData(freshCartData.data.cart);
          setLocalCartData(JSON.parse(JSON.stringify(freshCartData.data.cart))); // Ensure exact copy
        }
        toast({
          title: "Success",
          description: "Cart updated successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const removeVariant = (productId, variantId) => {
    setLocalCartData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Find the product
      const productIndex = newData.items.findIndex(item => item.productId === productId);
      if (productIndex === -1) return prevData;
      
      const product = newData.items[productIndex];
      
      // Remove the variant
      product.variants = product.variants.filter(v => v.variantId !== variantId);
      
      // If no variants left, remove the entire product
      if (product.variants.length === 0) {
        newData.items = newData.items.filter(item => item.productId !== productId);
      } else {
        // Update product totals
        product.totalQuantity = product.variants.reduce((sum, v) => sum + v.quantity, 0);
        product.productSubtotal = product.variants.reduce((sum, v) => sum + v.variantTotal, 0);
        
        // Recalculate bulk discount if applicable
        if (product.bulkDiscount && product.bulkDiscount.length > 0) {
          const applicableDiscount = product.bulkDiscount
            .filter(discount => product.totalQuantity >= discount.minQty)
            .sort((a, b) => b.minQty - a.minQty)[0];
          
          const discountPerUnit = applicableDiscount ? applicableDiscount.priceDiscountPerUnit : 0;
          product.productDiscount = discountPerUnit > 0 ? product.totalQuantity * discountPerUnit : 0;
          product.productTotal = product.productSubtotal - product.productDiscount;
        } else {
          product.productDiscount = 0;
          product.productTotal = product.productSubtotal;
        }
      }
      
      // Update cart summary
      newData.summary.subtotalBeforeDiscount = newData.items.reduce(
        (sum, item) => sum + item.productSubtotal,
        0
      );
      newData.summary.totalDiscount = newData.items.reduce(
        (sum, item) => sum + item.productDiscount,
        0
      );
      newData.summary.subtotalAfterDiscount = 
        newData.summary.subtotalBeforeDiscount - newData.summary.totalDiscount;
      newData.summary.cartTotal =
        newData.summary.subtotalAfterDiscount +
        newData.summary.shippingCharge +
        newData.summary.platformFee;
      
      return newData;
    });
  };

  const formatPrice = (price) => {
    const priceStr = price.toFixed(2);
    const [whole, decimal] = priceStr.split(".");
    const withCommas = whole.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    return `${withCommas}.${decimal}`;
  };

  // Helper function to determine if a product has active bulk discount
  const getVariantPricing = (variant) => {
    const product = cartData.items.find((item) =>
      item.variants.some((v) => v.variantId === variant.variantId)
    );

    if (!product?.bulkDiscount || product.bulkDiscount.length === 0) {
      return null;
    }

    const totalQuantity = variant.quantity;
    const applicableDiscount = product.bulkDiscount
      .filter((discount) => totalQuantity >= discount.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0];


    if (!applicableDiscount) return null;

    const discountPercentage = applicableDiscount.priceDiscountPerUnit
    const totalDiscountPrice = variant.basePrice * variant.quantity * applicableDiscount.priceDiscountPerUnit /100;
    const totalPrice = variant.basePrice * variant.quantity;
    const totalDiscountedPrice = totalPrice - totalDiscountPrice;

    return {
      discountPercentage,
      totalDiscountPrice,
      totalPrice,
      totalDiscountedPrice,
    };
  };

  // Add this helper function to check if cart data has unsaved changes
  const hasUnsavedChanges = () => {
    if (!cartData || !localCartData) return false;
    return JSON.stringify(cartData) !== JSON.stringify(localCartData);
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!localCartData) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
      </div>

      {!localCartData?.items || localCartData.items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {localCartData.items.map((item) => {
              return (
                <Card key={item.productId} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded bg-gray-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.productName}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">
                            Price: ₹{formatPrice(item.variants[0].basePrice)}
                          </span>
                          <span className="text-sm text-gray-600">
                            Total Qty: {item.totalQuantity}
                          </span>
                        </div>
                      </div>
                    </div>

                   
                    <div className="mt-3 space-y-3">
                      {item.variants.map((variant) => {
                        const variantPricing =
                          getVariantPricing(variant);
                        return (
                          <div
                            key={variant.variantId}
                            className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded"
                          >
                            <div className="flex-1">
                              <span className="text-sm text-gray-600 block">
                                {variant.attributes}
                              </span>
                              {variantPricing.discountPercentage > 0 && (
                                <span className="text-xs text-green-600 mt-1 block">
                                  {variantPricing.discountPercentage.toFixed(
                                    0
                                  )}
                                  % discount applied
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateLocalQuantity(
                                    item.productId,
                                    variant.variantId,
                                    variant.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <input
                                type="number"
                                className="w-12 text-center border rounded"
                                value={variant.quantity}
                                min="1"
                                max={variant.stock}
                                onChange={(e) => {
                                  const newQuantity = Math.min(
                                    Math.max(1, parseInt(e.target.value) || 1),
                                    variant.stock
                                  );
                                  updateLocalQuantity(
                                    item.productId,
                                    variant.variantId,
                                    newQuantity
                                  );
                                }}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateLocalQuantity(
                                    item.productId,
                                    variant.variantId,
                                    variant.quantity + 1
                                  )
                                }
                                disabled={
                                  !variant.inStock ||
                                  variant.quantity >= variant.stock
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-3 min-w-[100px] justify-end">
                              <div className="text-right">
                                <span className="font-semibold block">
                                  ₹{formatPrice(variantPricing.totalDiscountedPrice)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  removeVariant(
                                    item.productId,
                                    variant.variantId
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                   
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      ₹{formatPrice(cartData.summary.subtotalBeforeDiscount)}
                    </span>
                  </div>

                  {cartData.summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount</span>
                      <span>
                        -₹{formatPrice(cartData.summary.totalDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{formatPrice(cartData.summary.shippingCharge)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>₹{formatPrice(cartData.summary.platformFee)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{formatPrice(cartData.summary.cartTotal)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                {hasUnsavedChanges() && (
                  <Button
                    className="w-full flex items-center bg-accent text-black justify-center gap-2 hover:bg-accent/80"
                    onClick={updateCart}
                  >
                    Update Cart
                  </Button>
                )}
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate("/checkout")}
                  disabled={hasUnsavedChanges()}
                >
                  {hasUnsavedChanges() ? "Save changes before checkout" : "Checkout"} <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartContent;
