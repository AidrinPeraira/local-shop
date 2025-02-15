
import { Button } from "../components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const SavedList = () => {
  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-display font-bold text-primary mb-8">My Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-medium text-primary">{item.name}</h3>
                <p className="text-accent font-medium mt-1">${item.price}</p>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your wishlist is empty</p>
            <Link to="/">
              <Button className="bg-accent hover:bg-accent/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer/>
    </div>
  );
};

