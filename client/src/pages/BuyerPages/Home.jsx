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
  const industries = [
    { id: 1, name: "Equipments", image: "https://img.freepik.com/free-photo/person-their-job-position_23-2150163584.jpg?t=st=1741325045~exp=1741328645~hmac=3e5181756393886d0563bb0d6504f86804cb04ef13c65013486588588b92f205&w=740" },
    { id: 2, name: "Services", image: "https://img.freepik.com/free-photo/person-their-job-position_23-2150163577.jpg?ga=GA1.1.1465198438.1741275083" },
    { id: 3, name: "Healthcare", image: "https://img.freepik.com/free-photo/person-their-job-position_23-2150163569.jpg?t=st=1741324820~exp=1741328420~hmac=c6e6f2f0e2f7ab14827da271e2d442d4d50fae67d841ee487cef75b461781db9&w=740" },
    { id: 4, name: "Organic", image: "https://img.freepik.com/free-photo/person-their-job-position_23-2150163601.jpg?t=st=1741324885~exp=1741328485~hmac=10fd7beb587319b868301910c4fc26ef7194abd1709f0deddc5903ab617e31ff&w=740" },
    { id: 5, name: "Automotive", image: "https://img.freepik.com/free-photo/person-their-job-position_23-2150163610.jpg?t=st=1741324845~exp=1741328445~hmac=636a11bffa39a6317573687c62d80df5991ab3aaab199151e500577ee117e0a9&w=740" },
    { id: 6, name: "Logistics", image: "https://img.freepik.com/free-photo/person-their-job-position_23-2150163596.jpg?t=st=1741324777~exp=1741328377~hmac=0fbc98c236f2e6ba1cec50e724402ef6a89a56561eccf3b38935e7816764c5b0&w=1060" },
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
            {industries.map((category) => (
              <CarouselItem
                key={category.id}
                className="md:basis-1/4 lg:basis-1/6"
              >


                <div className="group cursor-pointer">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden mb-3 flex items-center justify-center">
                    <div className="opacity-40 group-hover:opacity-60 transition-opacity text-white">
                      {category.name === "Equipments" && (
                        <img src={category.image} alt={category.name} />
                      )}
                      {category.name === "Services" && (
                         <img src={category.image} alt={category.name} />
                      )}
                      {category.name === "Healthcare" && (
                        <img src={category.image} alt={category.name} />
                      )}
                      {category.name === "Organic" && (
                         <img src={category.image} alt={category.name} />
                      )}
                      {category.name === "Automotive" && (
                         <img src={category.image} alt={category.name} />
                      )}
                      {category.name === "Logistics" && (
                         <img src={category.image} alt={category.name} />
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
