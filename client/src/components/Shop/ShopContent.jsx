import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { Checkbox } from "../ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const categories = [
  { id: 'electronics', name: 'Electronics', count: 45 },
  { id: 'accessories', name: 'Accessories', count: 32 },
  { id: 'mobile', name: 'Mobile', count: 28 },
  { id: 'laptops', name: 'Laptops', count: 24 },
  { id: 'cameras', name: 'Cameras', count: 16 },
];

const brands = [
  { id: 'apple', name: 'Apple', count: 45 },
  { id: 'samsung', name: 'Samsung', count: 32 },
  { id: 'sony', name: 'Sony', count: 28 },
  { id: 'lg', name: 'LG', count: 24 },
  { id: 'asus', name: 'Asus', count: 16 },
];

const products = [
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: '/placeholder.svg',
    discount: 15,
    badge: 'HOT'
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: '/placeholder.svg',
    discount: 10,
    badge: 'NEW'
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: '/placeholder.svg',
    discount: 20,
    badge: 'SALE'
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: '/placeholder.svg',
    discount: 12,
    badge: 'BEST DEAL'
  },
];

const ShopContent = () => {
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    brands: true,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* Categories */}
          <Collapsible
            open={expanded.categories}
            onOpenChange={(isOpen) =>
              setExpanded((prev) => ({ ...prev, categories: isOpen }))
            }
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Categories</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  {expanded.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((id) => id !== category.id)
                          );
                        }
                      }}
                    />
                    <span className="flex-1">{category.name}</span>
                    <span className="text-sm text-gray-500">({category.count})</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-medium">1-12</span> of <span className="font-medium">48</span> products
            </p>
            <select className="border rounded-md px-3 py-1.5">
              <option>Sort by latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
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
                  <Button
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                </div>
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" fill={i < product.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
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
    </main>
  );
};

export default ShopContent;
