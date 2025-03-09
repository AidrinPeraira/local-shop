import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button.jsx";
import { Slider } from "../../components/ui/slider.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible.jsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination.jsx";
import { PageLoading } from "../ui/PageLoading.jsx";

const products = [
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
  {
    id: 1,
    name: "MacBook Pro 16",
    description: "Apple M2 Pro, 16GB RAM, 512GB SSD",
    price: 2499.99,
    rating: 5,
    reviews: 128,
    image: "/placeholder.svg",
    discount: 15,
    badge: "HOT",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro, 256GB, Titanium",
    price: 999.99,
    rating: 5,
    reviews: 89,
    image: "/placeholder.svg",
    discount: 10,
    badge: "NEW",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4",
    description: "Wireless Noise Cancelling Headphones",
    price: 349.99,
    rating: 4,
    reviews: 256,
    image: "/placeholder.svg",
    discount: 20,
    badge: "SALE",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    description: "8GB RAM, 256GB Storage",
    price: 899.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg",
    discount: 12,
    badge: "BEST DEAL",
  },
];

const ShopContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [initialParams, setInitialParams] = useState(null);
  const [currentParams, setCurrentParams] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const categories = useSelector((state) => state.categories.categories);
  const [sortOption, setSortOption] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);

  //SETTING THE pagination values
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  //setting the expanded state
  const [expanded, setExpanded] = useState({
    price: true,
    rating: true,
  });

  // create useEffect to handle rinitial params
  useEffect(() => {
    const initialPriceRange = searchParams
      .get("priceRange")
      ?.split(",")
      .map(Number) || [0, 3000];
    const initialRating = searchParams.get("rating") || null;
    const initialPage = Number(searchParams.get("page")) || 1;
    const initialSort = searchParams.get("sort") || "latest";

    setSortOption(initialSort);
    setCurrentPage(initialPage);

    if (!initialParams) {
      setInitialParams({
        priceRange: initialPriceRange,
        rating: initialRating,
        sort: initialSort,
        page: initialPage,
      });
    }

    setIsLoading(false);
  }, [searchParams]);

  //handle sort selections
  const handleSortChange = (e) => {
    const newSortValue = e.target.value;
    setSortOption(newSortValue);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSortValue);
    setSearchParams(newParams);
  };
  //handle rating selection
  const handleRatingChange = (checked, rating) => {
    setSelectedRating(checked ? rating.toString() : null);
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set("rating", rating.toString());
    } else {
      newParams.delete("rating");
    }
    setSearchParams(newParams);
  };
  //get category path or breadcrumbs
  const findCategoryPath = (categoryId) => {
    const path = [];

    for (const category of categories) {
      for (const subCategory of category.subCategories) {
        for (const subSubCategory of subCategory.subSubCategories) {
          if (subSubCategory._id === categoryId) {
            path.unshift({
              id: subSubCategory._id,
              name: subSubCategory.name,
              level: subSubCategory.level,
            });
            path.unshift({
              id: subCategory._id,
              name: subCategory.name,
              level: subCategory.level,
            });
            path.unshift({
              id: category._id,
              name: category.name,
              level: category.level,
            });
            return path;
          }
        }
      }
    }
  };
  // Get category ID from URL
  const selectedCategoryId = searchParams.get("category");
  const categoryPath = selectedCategoryId
    ? findCategoryPath(selectedCategoryId)
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber.toString());
    setSearchParams(newParams);
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("priceRange", priceRange.join(","));
    if (selectedRating) {
      newParams.set("rating", selectedRating);
    } else {
      newParams.delete("rating");
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    if (initialParams) {
      setPriceRange(initialParams.priceRange);
      setSelectedRating(initialParams.rating);
      setSortOption(initialParams.sort);
      setCurrentPage(1);

      const newParams = new URLSearchParams(searchParams);
      newParams.set("priceRange", initialParams.priceRange.join(","));
      newParams.set("sort", initialParams.sort);
      newParams.set("page", "1");
      if (initialParams.rating) {
        newParams.set("rating", initialParams.rating);
      } else {
        newParams.delete("rating");
      }
      setSearchParams(newParams);
    }
  };


  return (
    <main className="container mx-auto px-4 py-8">
      {/* breadcrumbs */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                Home
              </a>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </li>
            <li>
              <a
                href="/shop"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Shop
              </a>
            </li>
            {categoryPath.map((category, index) => (
              <React.Fragment key={category.id}>
                <li>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </li>
                <li>
                  {index === categoryPath.length - 1 ? (
                    <span className="text-gray-900 font-medium text-sm">
                      {category.name}
                    </span>
                  ) : (
                    <a
                      href={`/shop?category=${category.id}`}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {category.name}
                    </a>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* Price Range */}
          <Collapsible
            open={expanded.price}
            onOpenChange={(isOpen) =>
              setExpanded((prev) => ({ ...prev, price: isOpen }))
            }
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Price Range</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  {expanded.price ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="px-2 pt-4">
                <Slider
                  defaultValue={[0, 3000]}
                  max={3000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Rating Filter */}
          <Collapsible
            open={expanded.rating}
            onOpenChange={(isOpen) =>
              setExpanded((prev) => ({ ...prev, rating: isOpen }))
            }
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Rating</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  {expanded.rating ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedRating === rating.toString()}
                      onCheckedChange={(checked) =>
                        handleRatingChange(checked, rating)
                      }
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4"
                            fill={i < rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex gap-2 mt-6">
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={handleApplyFilters}>
              Apply
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* product per page and sort field */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {startIndex + 1}-{Math.min(endIndex, totalProducts)}
              </span>{" "}
              of <span className="font-medium">{totalProducts}</span> products
            </p>
            <select
              className="border rounded-md px-3 py-1.5"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="latest">Sort by latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              <div className="m-auto w-48 h-48 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              currentProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <Button
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
                          fill={i < product.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">
                      $
                      {(product.price * (1 + product.discount / 100)).toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              {/* previoius page button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    currentPage > 1 && handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* array map to show page one , last , current, current + and - 1 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              {/* next page button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
};

export default ShopContent;
