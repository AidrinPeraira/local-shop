import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../components/hooks/use-toast";
import { getCartItemsAPI } from "../../api/cartApi";
import { PageLoading } from "../ui/PageLoading";

const CartContent = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await getCartItemsAPI();
      setCartData(response.data.cart);
    } catch (error) {
      console.log("fetchCartData error", error);
      toast({
        title: "Error",
        description: `error`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, variantId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          variantId,
          quantity: newQuantity,
        }),
        credentials: "include",
      });

      if (response.ok) {
        fetchCartData(); // Refresh cart data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeVariant = async (productId, variantId) => {
    return;
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          variantId,
        }),
        credentials: "include",
      });

      if (response.ok) {
        fetchCartData();
        toast({
          title: "Success",
          description: "Item removed from cart",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
      </div>

      {!cartData?.items || cartData.items.length === 0 ? (
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
            {cartData.items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded bg-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    {item.variants.map((variant) => (
                      <div
                        key={variant.variantId}
                        className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded mt-3"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {variant.attributes}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  variant.variantId,
                                  variant.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {variant.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(
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
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-semibold block">
                              ₹{variant.subtotal.toFixed(2)}
                            </span>
                            {variant.discountPerUnit > 0 && (
                              <span className="text-green-600 text-sm">
                                Save {variant.discountPerUnit}% per item
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeVariant(item.productId, variant.variantId)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{cartData.cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span>₹{cartData.cartTotal > 500 ? "0.00" : "15.00"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ₹
                      {(
                        cartData.cartTotal + (cartData.cartTotal > 500 ? 0 : 15)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                <Button
                  className="w-full flex items-center bg-accent text-black justify-center gap-2 hover:bg-accent/80"
                  onClick={() => navigate("/checkout")}
                >
                  Update Cart
                </Button>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout <ArrowRight className="h-4 w-4" />
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
