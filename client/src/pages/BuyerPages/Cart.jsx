import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import CartHeader from "../../components/cart/CartHeader";
import CartSummary from "../../components/cart/CartSummary";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default () => {
  // Mock cart data with variants
  const cartItems = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      variants: {
        material: "100% Cotton",
        size: "Large",
        color: "Navy Blue",
      },
    },
    {
      id: 2,
      name: "Classic Denim Jeans",
      price: 59.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      variants: {
        material: "Denim",
        size: "32",
        color: "Dark Blue",
      },
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.99;
  const discount = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 pt-3 pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            <CartHeader />

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-start gap-4">
                    <Checkbox />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/shop/${item.id}`}
                        className="font-medium text-primary hover:text-accent line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-1 space-y-1 text-sm text-gray-600">
                        <p>Material: {item.variants.material}</p>
                        <p>Size: {item.variants.size}</p>
                        <p>Color: {item.variants.color}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            className="w-12 h-8 text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24">
            <CartSummary
              itemCount={cartItems.length}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
