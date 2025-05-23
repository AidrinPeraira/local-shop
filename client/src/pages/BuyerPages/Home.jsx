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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getShopProductsApi } from "../../api/productApi";
import { useToast } from "../../components/hooks/use-toast";

export default function Home() {
  

  
  const { categories } = useSelector((state) => state.categories);
  const [categoryProducts, setCategoryProducts] = useState({});
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('blocked') === 'true') {
      toast({
        variant: "destructive",
        title: "Account Blocked",
        description: "Your account has been blocked. Please contact admin for assistance",
      });
    }
  }, [searchParams, toast]);

  // Get level 3 categories
  const level3Categories = categories.flatMap((l1) => {
    return l1.subCategories.flatMap((l2) =>
      l2.subSubCategories?.map((l3) => {
        return {
          id: l3._id,
          name: l3.name,
          image: null,
        };
      })
    );
  }).slice(0, 10);

  // Fetch one product for each category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const productPromises = level3Categories.map(async (category) => {
          const query = `category=${category.id}&limit=1`;
          const response = await getShopProductsApi(query);
          if (response.data?.products?.[0]?.images?.[0]) {
            return {
              categoryId: category.id,
              image: response.data.products[0].images[0],
            };
          }
          return null;
        });

        const results = await Promise.all(productPromises);
        const productImages = {};
        results.forEach((result) => {
          if (result) {
            productImages[result.categoryId] = result.image;
          }
        });
        setCategoryProducts(productImages);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };

    if (level3Categories.length > 0) {
      fetchCategoryProducts();
    }
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {/* CAROUSEL. CAN ADD MORE IMAGES */}
                <CarouselItem>
                  <div className="relative h-[400px] bg-gradient-to-r from-gray-950 to-gray-700 rounded-2xl overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-70"
                      style={{
                        backgroundImage:
                          "url('https://media.istockphoto.com/id/1413198675/photo/happy-senior-man-working-as-a-cashier-at-supermarket.jpg?s=1024x1024&w=is&k=20&c=s-7CQletxen5yfioJJP_7K0V4BEoCtZnX2oT-im7Xiw=')",
                      }}
                    />
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white max-w-lg">
                      <h2 className="text-4xl font-bold mb-4">
                        Empower Your Business with Seamless Transactions
                      </h2>
                      <p className="text-lg mb-6  text-white/80">
                        Streamline your sales with secure and efficient checkout
                        systems designed for modern businesses.
                      </p>
                      <Button size="lg" variant="default">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* side card x 2 */}
          <div className="grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-950 to-gray-700">
              <div
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  backgroundImage:
                    "url('https://img.freepik.com/free-photo/view-man-handling-money-funds-wealth-prosperity_23-2151660785.jpg?semt=ais_hybrid')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="absolute inset-0  bg-black/40 z-0" />

              <div className="relative p-6 text-white z-10">
                <div className="flex items-center mb-2">
                  <BarChart3 className="mr-2 h-5 w-5  text-amber-100" />
                  <span className=" text-amber-300 uppercase tracking-wider text-xs font-semibold ">
                    Business Growth
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Boost Your Sales</h3>
                <p className="text-sm mb-3  text-amber-100">
                  Connect with pre-qualified buyers actively seeking your
                  products
                </p>
                <Link to="/seller/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-black border-white/20 hover:bg-white/20"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-950 to-gray-700">
              <div
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  backgroundImage:
                    "url('https://www.shutterstock.com/shutterstock/photos/2221707711/display_1500/stock-photo-indian-small-business-owner-showing-mobile-and-pointing-towards-it-2221707711.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Darker Overlay for better contrast */}
              <div className="absolute inset-0 bg-black/50 z-0" />

              {/* Content Wrapper with proper z-index */}
              <div className="relative p-6 text-white z-10">
                <div className="flex items-center mb-2">
                  <ShieldCheck className="mr-2 h-5 w-5 text-amber-100" />
                  <span className="text-amber-300 uppercase tracking-wider text-xs font-semibold">
                    Verified Suppliers
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Trading</h3>
                <p className="text-sm mb-3 text-amber-100">
                  Work with verified partners and protect your business with our
                  escrow service.
                </p>
                <Link to="/seller/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border border-white text-black hover:bg-white/20"
                  >
                    Trade Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Product Categories</h2>
            <p className="text-gray-600">
              Explore opportunities across specialized business categories
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {level3Categories.map((category) => (
               <Link 
               key={category.id} 
               to={`/shop?category=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
             >
              <div key={category?._id} className="flex-none w-64">
                <div className="group cursor-pointer">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden mb-3">
                    <div className="opacity-40 group-hover:opacity-60 transition-opacity">
                      {categoryProducts[category?.id] ? (
                        <img
                          src={categoryProducts[category?.id]}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <span className="text-white font-medium text-center w-full">
                        {category?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            ))}
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
