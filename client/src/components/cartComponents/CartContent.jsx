import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Package,
  ShieldCheck,
  Info,
  Tag
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import { useToast } from "../hooks/use-toast";
import { getCartItemsAPI, getCartItemsCountAPI, updateCartAPI } from "../../api/cartApi";
import { PageLoading } from "../ui/PageLoading";
import { useDispatch } from "react-redux";
import { clearCart, setCart, setCartCount } from "../../redux/features/cartSlice";

const CartContent = () => {
  const [cartData, setCartData] = useState(null);
  const [localCartData, setLocalCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
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
        dispatch(setCart(response.data.cart));
        setCartData(response.data.cart);
      } else {
        throw new Error("Failed to fetch cart data");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cart data",
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

      // Update totals for all variants
      item.variants.forEach(v => {
        v.variantTotal = v.basePrice * v.quantity;
      });

      // Update product totals
      item.totalQuantity = item.variants.reduce(
        (sum, v) => sum + v.quantity,
        0
      );

      item.productSubtotal = item.variants.reduce(
        (sum, v) => sum + v.variantTotal,
        0
      );

      // Calculate bulk discount if applicable
      if (item.bulkDiscount && item.bulkDiscount.length > 0) {
        const applicableDiscount = item.bulkDiscount
          .filter((discount) => item.totalQuantity >= discount.minQty)
          .sort((a, b) => b.minQty - a.minQty)[0];

        if (applicableDiscount) {
          const discountPercentage = applicableDiscount.priceDiscountPerUnit;
          item.productDiscount = (item.productSubtotal * discountPercentage) / 100;
        } else {
          item.productDiscount = 0;
        }
      } else {
        item.productDiscount = 0;
      }

      item.productTotal = item.productSubtotal - item.productDiscount;

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

      // Update shipping charge based on total amount
      newData.summary.shippingCharge = 
        newData.summary.subtotalBeforeDiscount >= 5000 ? 0 : 500;

      newData.summary.cartTotal =
        newData.summary.subtotalAfterDiscount +
        newData.summary.shippingCharge +
        newData.summary.platformFee;

      return newData;
    });
  };

  const updateCart = async () => {
    try {
      const updates = localCartData.items.flatMap((item) =>
        item.variants.map((variant) => ({
          productId: item.productId,
          variantId: variant.variantId,
          quantity: variant.quantity,
          attributes: variant.attributes,
        }))
      );

      const response = await updateCartAPI({ variants: updates });

      if (response.data.success) {
        const [freshCartData, cartCountData] = await Promise.all([
          getCartItemsAPI(),
          getCartItemsCountAPI()
        ]);
  
        if (freshCartData.data.success) {
          setCartData(freshCartData.data.cart);
          dispatch(setCart(freshCartData.data.cart));
          setLocalCartData(JSON.parse(JSON.stringify(freshCartData.data.cart)));
          
          // Update the cart count in global state
          if (cartCountData.data.success) {
            dispatch(setCartCount(cartCountData.data.count));
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if(hasUnsavedChanges()){
      updateCart();
    }
  }, [localCartData])

  const removeVariant = (productId, variantId) => {
    setLocalCartData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));

      // Find the product
      const productIndex = newData.items.findIndex(
        (item) => item.productId === productId
      );
      if (productIndex === -1) return prevData;

      const product = newData.items[productIndex];

      // Remove the variant
      product.variants = product.variants.filter(
        (v) => v.variantId !== variantId
      );

      // If no variants left, remove the entire product
      if (product.variants.length === 0) {
        newData.items = newData.items.filter(
          (item) => item.productId !== productId
        );
      } else {
        // Update product totals
        product.totalQuantity = product.variants.reduce(
          (sum, v) => sum + v.quantity,
          0
        );
        product.productSubtotal = product.variants.reduce(
          (sum, v) => sum + v.variantTotal,
          0
        );

        // Recalculate bulk discount if applicable
        if (product.bulkDiscount && product.bulkDiscount.length > 0) {
          const applicableDiscount = product.bulkDiscount
            .filter((discount) => product.totalQuantity >= discount.minQty)
            .sort((a, b) => b.minQty - a.minQty)[0];

          const discountPerUnit = applicableDiscount
            ? applicableDiscount.priceDiscountPerUnit
            : 0;
          product.productDiscount =
            discountPerUnit > 0 ? product.totalQuantity * discountPerUnit : 0;
          product.productTotal =
            product.productSubtotal - product.productDiscount;
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
      return {
        discountPercentage: 0,
        totalDiscountPrice: 0,
        totalPrice: variant.basePrice * variant.quantity,
        totalDiscountedPrice: variant.basePrice * variant.quantity,
      };
    }

    const totalQuantity = product.totalQuantity; // Use total product quantity
    const applicableDiscount = product.bulkDiscount
      .filter((discount) => totalQuantity >= discount.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0];

    if (!applicableDiscount) {
      return {
        discountPercentage: 0,
        totalDiscountPrice: 0,
        totalPrice: variant.basePrice * variant.quantity,
        totalDiscountedPrice: variant.basePrice * variant.quantity,
      };
    }

    const totalPrice = variant.basePrice * variant.quantity;
    const discountPercentage = applicableDiscount.priceDiscountPerUnit;
    const totalDiscountPrice = (totalPrice * discountPercentage) / 100;
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

  const handleCheckout = async () => {
    const selectedProducts = localCartData.items

    // Calculate totals for selected items only
    const subtotalBeforeDiscount = selectedProducts.reduce(
      (sum, item) => sum + item.productSubtotal, 0
    );
    const totalDiscount = selectedProducts.reduce(
      (sum, item) => sum + item.productDiscount, 0
    );
    const subtotalAfterDiscount = subtotalBeforeDiscount - totalDiscount;
    const shippingCharge = subtotalBeforeDiscount >= 5000 ? 0 : 500;
    const platformFee = 1000;
    const cartTotal = subtotalAfterDiscount + shippingCharge + platformFee;

    // Structure data for checkout
    const checkoutData = {
      cart: {
        items: selectedProducts.map(item => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          seller: {
            _id: item.seller._id,
            sellerName: item.seller.sellerName
          },
          variants: item.variants.map(variant => ({
            variantId: variant.variantId,
            attributes: variant.attributes,
            quantity: variant.quantity,
            basePrice: variant.basePrice,
            discountedPrice: variant.discountedPrice,
            variantDiscount: variant.variantDiscount,
            variantTotal: variant.variantTotal,
            stock: variant.stock,
            inStock: variant.inStock
          })),
          bulkDiscount: item.bulkDiscount,
          productSubtotal: item.productSubtotal,
          productDiscount: item.productDiscount,
          productTotal: item.productTotal,
          totalQuantity: item.totalQuantity,
          isActive: item.isActive,
          isBlocked: item.isBlocked
        })),
        summary: {
          subtotalBeforeDiscount,
          totalDiscount,
          subtotalAfterDiscount,
          shippingCharge,
          platformFee,
          cartTotal
        }
      },
      loading: false,
      error: null
    };

    dispatch(setCart(checkoutData.cart));
    navigate("/checkout");
  }
  
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

  const getInvalidProducts = () => {
    if (!localCartData?.items) return [];
    return localCartData.items.filter(
      (item) =>
        item.isBlocked ||
        !item.isActive ||
        item.variants.some((v) => !v.inStock)
    );
  };

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
              const isInvalid = item.isBlocked || !item.isActive;
              const hasOutOfStock = item.variants.some((v) => !v.inStock);

              return (
                <Card
                  key={item.productId}
                  className={`overflow-hidden ${
                    isInvalid ? "border-red-500" : ""
                  }`}
                >
                  <CardContent className="p-4">

                  

                    {/* Add warning message if product is invalid */}
                    {(isInvalid || hasOutOfStock) && (
                      <div className="mb-3 p-2 bg-red-50 text-red-600 rounded">
                        {/* {item.isBlocked && "This product has been blocked."} */}
                        {(item.isBlocked || !item.isActive) &&
                          "This product is no longer available."}
                        {hasOutOfStock && "Some variants are out of stock."}
                        <Button
                          variant="link"
                          className="text-red-600 p-0 ml-2"
                          onClick={() =>
                            item.variants.forEach((v) =>
                              removeVariant(item.productId, v.variantId)
                            )
                          }
                        >
                          Remove from cart
                        </Button>
                      </div>
                    )}
                    <Link
                      to={`/product?id=${item.productId}`}
                      className="group block"
                    >
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
                          {/* Add seller details */}
                          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <ShoppingBag className="h-3 w-3" />
                            <span>Sold by: </span>                          
                              {item.seller.sellerName || "Unknown Seller"}
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-3 space-y-3">
                      {item.variants.map((variant) => {
                        const variantPricing = getVariantPricing(variant);
                        return (
                          <div
                            key={variant.variantId}
                            className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded"
                          >
                            <div className="flex-1">
                              <span className="text-sm text-gray-600 block">
                                {variant.attributes}
                              </span>
                              {variantPricing?.discountPercentage > 0 && (
                                <span className="text-xs text-green-600 mt-1 block">
                                  {variantPricing.discountPercentage.toFixed(0)}
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
                                  ₹
                                  {formatPrice(
                                    variantPricing
                                      ? variantPricing.totalDiscountedPrice
                                      : variant.basePrice * variant.quantity
                                  )}
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
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{formatPrice(cartData.summary.subtotalBeforeDiscount)}</span>
                  </div>

                  {/* Bulk Discount */}
                  {cartData.summary.totalDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Bulk Discount</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Discount applied for bulk purchases</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-green-600">
                        -₹{formatPrice(cartData.summary.totalDiscount)}
                      </span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Shipping</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Free shipping on orders above ₹5000</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span>{cartData.summary.shippingCharge > 0 ? 
                      `₹${formatPrice(cartData.summary.shippingCharge)}` : 
                      'FREE'}</span>
                  </div>

                  {/* Platform Fee */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Platform Fee</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Covers secure payment processing and buyer protection</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span>₹{formatPrice(cartData.summary.platformFee)}</span>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{formatPrice(cartData.summary.cartTotal)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                
               <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={
                    hasUnsavedChanges() || 
                    getInvalidProducts().length > 0 
                  }
                >
                  {hasUnsavedChanges()
                    ? "Updating Cart"
                    : getInvalidProducts().length > 0
                    ? "Remove invalid items to proceed"
                    : "Checkout"}{" "}
                  <ArrowRight className="h-4 w-4" />
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
