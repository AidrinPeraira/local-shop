import { useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Button } from "../../components/ui/button";
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  Headphones,
  ArrowLeft,
  ArrowRight,
  Building2,
  Factory,
  Globe,
  BarChart3,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const categories = [
    { id: 1, name: "Electronics", image: "/placeholder.svg" },
    { id: 2, name: "Manufacturing", image: "/placeholder.svg" },
    { id: 3, name: "Healthcare", image: "/placeholder.svg" },
    { id: 4, name: "Construction", image: "/placeholder.svg" },
    { id: 5, name: "Automotive", image: "/placeholder.svg" },
    { id: 6, name: "Logistics", image: "/placeholder.svg" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "MacBook Pro 16",
      price: 2499.99,
      rating: 5,
      image: "/placeholder.svg",
      discount: 15,
      badge: "HOT",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: 999.99,
      rating: 5,
      image: "/placeholder.svg",
      discount: 10,
      badge: "NEW",
    },
    {
      id: 3,
      name: "Sony WH-1000XM4",
      price: 349.99,
      rating: 4,
      image: "/placeholder.svg",
      discount: 20,
      badge: "SALE",
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      price: 899.99,
      rating: 5,
      image: "/placeholder.svg",
      discount: 12,
      badge: "BEST DEAL",
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
                  <div className="relative h-[400px] bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl overflow-hidden">
                    <div
                      className="absolute inset-0 bg-pattern opacity-10"
                      style={{
                        backgroundImage:
                          "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                      }}
                    />
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white max-w-lg">
                      <div className="flex items-center mb-2">
                        <Building2 className="mr-2 h-6 w-6" />
                        <span className="text-blue-200 uppercase tracking-wider text-sm font-semibold">
                          B2B Marketplace
                        </span>
                      </div>
                      <h2 className="text-4xl font-bold mb-4">
                        Connect, Source & Grow Your Business
                      </h2>
                      <p className="text-lg mb-6 text-blue-100">
                        Join thousands of businesses streamlining their
                        procurement and expanding their network on our trusted
                        B2B platform.
                      </p>
                      <div className="flex gap-3">
                        <Link to="/login">
                          <Button size="lg" variant="default">
                            Join Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="absolute right-0 bottom-0 h-[90%] w-1/3">
                      <Factory className="h-full w-full text-white/10" />
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative h-[400px] bg-gradient-to-r from-purple-900 to-indigo-800 rounded-2xl overflow-hidden">
                    <div
                      className="absolute inset-0 bg-pattern opacity-10"
                      style={{
                        backgroundImage:
                          "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                      }}
                    />
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white max-w-lg">
                      <div className="flex items-center mb-2">
                        <Globe className="mr-2 h-6 w-6" />
                        <span className="text-purple-200 uppercase tracking-wider text-sm font-semibold">
                          Global Reach
                        </span>
                      </div>
                      <h2 className="text-4xl font-bold mb-4">
                        Access International Markets
                      </h2>
                      <p className="text-lg mb-6 text-purple-100">
                        Connect with verified suppliers and buyers from over 120
                        countries. Expand your business globally with our
                        cross-border trade solutions.
                      </p>
                      <Button size="lg" variant="default">
                        Explore Markets
                      </Button>
                    </div>
                    <div className="absolute right-0 bottom-0 h-[90%] w-1/3">
                      <Globe className="h-full w-full text-white/10" />
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-green-700 to-emerald-600">
              <div
                className="absolute inset-0 bg-pattern opacity-10"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                }}
              />
              <div className="p-6 text-white">
                <div className="flex items-center mb-2">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  <span className="text-green-200 uppercase tracking-wider text-xs font-semibold">
                    Business Growth
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Boost Your Sales</h3>
                <p className="text-sm mb-3 text-green-100">
                  Connect with pre-qualified buyers actively seeking your
                  products
                </p>
                <Link to="/seller/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-700 to-orange-600">
              <div
                className="absolute inset-0 bg-pattern opacity-10"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                }}
              />
              <div className="p-6 text-white">
                <div className="flex items-center mb-2">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  <span className="text-amber-200 uppercase tracking-wider text-xs font-semibold">
                    Verified Suppliers
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Trading</h3>
                <p className="text-sm mb-3 text-amber-100">
                  Work with verified partners and protect your business with our
                  escrow service
                </p>
                <Link to="/seller/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Trade Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Our B2B Marketplace
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform streamlines business connections and transactions with
            powerful tools designed for modern enterprises
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Logistics Integration</h3>
              <p className="text-sm text-gray-600">
                Seamless shipping solutions with real-time tracking and customs
                documentation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Simplified Procurement</h3>
              <p className="text-sm text-gray-600">
                Streamline purchasing with RFQs, comparisons and automated
                reordering
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Transactions</h3>
              <p className="text-sm text-gray-600">
                Protected payments and verified business partners
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Dedicated Support</h3>
              <p className="text-sm text-gray-600">
                Industry specialists available to assist with all business needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Industry Sectors</h2>
            <p className="text-gray-600">
              Explore opportunities across diverse business categories
            </p>
          </div>
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
              <CarouselItem
                key={category.id}
                className="md:basis-1/4 lg:basis-1/6"
              >
                <div className="group cursor-pointer">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden mb-3 flex items-center justify-center">
                    <div className="opacity-40 group-hover:opacity-60 transition-opacity text-white">
                      {category.name === "Electronics" && (
                        <Factory className="h-12 w-12" />
                      )}
                      {category.name === "Manufacturing" && (
                        <Factory className="h-12 w-12" />
                      )}
                      {category.name === "Healthcare" && (
                        <Building2 className="h-12 w-12" />
                      )}
                      {category.name === "Construction" && (
                        <Building2 className="h-12 w-12" />
                      )}
                      {category.name === "Automotive" && (
                        <Truck className="h-12 w-12" />
                      )}
                      {category.name === "Logistics" && (
                        <Truck className="h-12 w-12" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <span className="text-white font-medium text-center w-full">
                        {category.name}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl bg-gradient-to-br from-primary to-blue-700 p-8 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Grow Your Business</h2>
              <p className="text-lg mb-6">
                With our comprehensive B2B tools and network
              </p>
              <Link to="/login">
                <Button variant="secondary" className="w-fit">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Platform Benefits</h2>
                <p className="text-gray-600">
                  Discover how our marketplace helps businesses thrive
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="ghost" size="sm">
                  Suppliers
                </Button>
                <Button variant="ghost" size="sm">
                  Buyers
                </Button>
                <Button variant="ghost" size="sm">
                  Services
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Global Reach</h3>
                <p className="text-gray-600 mb-4">
                  Access international markets and connect with businesses
                  worldwide
                </p>
                
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Market Insights</h3>
                <p className="text-gray-600 mb-4">
                  Data-driven insights to help you make informed business
                  decisions
                </p>
                
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Verified Partners</h3>
                <p className="text-gray-600 mb-4">
                  Work with pre-screened, legitimate business partners you can
                  trust
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
