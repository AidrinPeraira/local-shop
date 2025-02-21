import { useRef } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Button } from "../../components/ui/button";
import { Truck, RefreshCw, ShieldCheck, Headphones, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

export const Home = () => {
  const categories = [
    { id: 1, name: 'Laptops', image: '/placeholder.svg' },
    { id: 2, name: 'Smartphones', image: '/placeholder.svg' },
    { id: 3, name: 'Headphones', image: '/placeholder.svg' },
    { id: 4, name: 'Cameras', image: '/placeholder.svg' },
    { id: 5, name: 'Gaming', image: '/placeholder.svg' },
    { id: 6, name: 'Accessories', image: '/placeholder.svg' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "MacBook Pro 16",
      price: 2499.99,
      rating: 5,
      image: '/placeholder.svg',
      discount: 15,
      badge: 'HOT'
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: 999.99,
      rating: 5,
      image: '/placeholder.svg',
      discount: 10,
      badge: 'NEW'
    },
    {
      id: 3,
      name: "Sony WH-1000XM4",
      price: 349.99,
      rating: 4,
      image: '/placeholder.svg',
      discount: 20,
      badge: 'SALE'
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      price: 899.99,
      rating: 5,
      image: '/placeholder.svg',
      discount: 12,
      badge: 'BEST DEAL'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[400px] bg-primary rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white">
                      <h2 className="text-4xl font-bold mb-4">Xbox Series X</h2>
                      <p className="text-lg mb-6">Experience next-gen gaming</p>
                      <Button size="lg" variant="default">
                        Shop Now
                      </Button>
                    </div>
                    <img 
                      src="/placeholder.svg"
                      alt="Xbox Series X"
                      className="absolute right-0 h-full w-1/2 object-cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-blue-100">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <h3 className="text-xl font-bold mb-2">iPhone 15</h3>
                <Button variant="default" size="sm">Learn More</Button>
              </div>
              <img 
                src="/placeholder.svg"
                alt="iPhone 15"
                className="absolute right-0 h-full w-1/2 object-cover"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-purple-100">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <h3 className="text-xl font-bold mb-2">AirPods Pro</h3>
                <Button variant="default" size="sm">Shop Now</Button>
              </div>
              <img 
                src="/placeholder.svg"
                alt="AirPods Pro"
                className="absolute right-0 h-full w-1/2 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Delivery in 24H</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">24 Hours Return</h3>
              <p className="text-sm text-gray-600">100% money-back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-gray-600">Safe transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600">Live contact & messaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Shop by Categories</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {categories.map((category) => (
              <CarouselItem key={category.id} className="md:basis-1/4 lg:basis-1/6">
                <div className="group cursor-pointer">
                  <div className="aspect-square rounded-xl bg-gray-100 relative overflow-hidden mb-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-center font-medium">{category.name}</h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl bg-primary p-8 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">32% Discount</h2>
              <p className="text-lg mb-6">on Electronics</p>
              <Button variant="secondary" className="w-fit">
                Shop Now
              </Button>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="ghost" size="sm">Smartphones</Button>
                <Button variant="ghost" size="sm">Laptops</Button>
                <Button variant="ghost" size="sm">Accessories</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-primary text-white rounded">
                      {product.badge}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
                      -{product.discount}%
                    </span>
                  </div>
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {"★".repeat(product.rating)}
                      {"☆".repeat(5 - product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">
                      ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

