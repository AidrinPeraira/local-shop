import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ProductPurchaseCard from "../Product/ProducPurchaseCard";
import {
  ShoppingCart,
  Trash2,
  Heart,
  ArrowRight,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../hooks/use-toast";
import { PageLoading } from "../ui/PageLoading";
import { getWishlistApi, removeFromWishlistApi } from "../../api/wishlistApi";
import { addToCartAPI } from "../../api/cartApi";

const SavedListContent = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlistApi();
        setSavedItems(response.data.wishlist.products || []);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch wishlist",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlistApi(productId);
      setSavedItems((prev) => prev.filter((item) => item._id !== productId));
      toast({
        title: "Item Removed",
        description: "Item removed from saved list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCartAPI({ productId, quantity: 1 });
      await handleRemoveItem(productId);
      toast({
        title: "Added to Cart",
        description: "Item moved to cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Saved Items ({savedItems.length})
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Continue Shopping
        </Button>
      </div>

      {savedItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your saved list is empty</h2>
            <p className="text-gray-500 mb-4">
              Save items you want to buy later!
            </p>
            <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {savedItems.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32">
                    <img
                      src={item.images[0]}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Link
                      to={`/product/${item.slug}?id=${item._id}`}
                      className="text-lg font-semibold hover:text-primary"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-gray-500">Seller: {item.seller.sellerName}</p>
                    <p className="text-xl font-bold">₹{item.basePrice.toFixed(2)}</p>
                    
                  </div>
                 
                  <div className="flex flex-col gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-[500px] flex flex-col h-full">
                        <SheetHeader className="flex-none">
                          <SheetTitle>Add to Cart</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 flex-1 overflow-y-auto">
                          <ProductPurchaseCard 
                            product={{
                              id: item._id,
                              name: item.productName,
                              price: item.basePrice,
                              rating: item.avgRating,
                              reviewCount: item.reviewCount,
                              images: item.images,
                              inStock: item.inStock,
                              variantTypes: item.variantTypes,
                              variants: item.variants,
                              bulkDiscount: item.bulkDiscount,
                              stockUnit: item.stockUnit,
                              seller: item.seller
                            }} 
                            mode="cart"
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveItem(item._id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedListContent;