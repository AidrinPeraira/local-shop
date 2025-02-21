
import { useState } from "react";
import ProductGallery from "../../components/Product/ProductGallery";
import ProductInfo from "../../components/Product/ProductInfo";
import ShippingInfo from "../../components/Product/ShippingInfo";
import ProductSpecs from "../../components/Product/ProductSpecs";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// Mock data (replace with real data from your backend)
const mockProduct = {
  id: 1,
  title: "Premium Cotton T-Shirt",
  price: 29.99,
  originalPrice: 39.99,
  description:
    "Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this shirt features a modern fit and exceptional durability.",
  colors: ["White", "Black", "Navy", "Gray"],
  sizes: ["XS", "S", "M", "L", "XL"],
  stock: 50,
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      alt: "White t-shirt front view",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      alt: "White t-shirt back view",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800",
      alt: "White t-shirt detail view",
    },
  ],
  specifications: [
    { label: "Material", value: "100% Organic Cotton" },
    { label: "Weight", value: "180g/m²" },
    { label: "Fit", value: "Regular Fit" },
    { label: "Care", value: "Machine Wash Cold" },
    { label: "Origin", value: "Made in Portugal" },
    { label: "Style", value: "Crew Neck" },
    { label: "Season", value: "All Season" },
    { label: "Sustainability", value: "Eco-Friendly" },
  ],
};

export const Product = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-3 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Gallery */}
          <div className="sticky top-24">
            <ProductGallery images={mockProduct.images} />
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-8">
            <ProductInfo
              title={mockProduct.title}
              price={mockProduct.price}
              originalPrice={mockProduct.originalPrice}
              description={mockProduct.description}
              colors={mockProduct.colors}
              sizes={mockProduct.sizes}
              stock={mockProduct.stock}
            />
            
            <ShippingInfo />
            
            <ProductSpecs specifications={mockProduct.specifications} />
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

