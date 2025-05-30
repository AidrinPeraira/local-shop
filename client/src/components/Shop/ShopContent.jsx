import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setWishlistCount } from "../../redux/features/wishlistSlice";
import { Button } from "../../components/ui/button.jsx";
import { Slider } from "../../components/ui/slider.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { getShopProductsApi } from "../../api/productApi.js";
import { useToast } from "../hooks/use-toast.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import ProductPurchaseCard from "../Product/ProducPurchaseCard";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  getWishlistApi,
  getWishlistCountApi,
} from "../../api/wishlistApi";

const ShopContent = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [initialParams, setInitialParams] = useState(null);
  const [currentParams, setCurrentParams] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const categories = useSelector((state) => state.categories.categories);
  const [sortOption, setSortOption] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [expanded, setExpanded] = useState({
    price: false,
    rating: false,
  });
  const [tempRating, setTempRating] = useState(null);

  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  //SETTING THE pagination values
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  //temp????
  const [endIndex, setEndIndex] = useState(12);
  const [currentProducts, setCurrentProducts] = useState([]);

  //useeffect to handle side bar collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setExpanded((prev) => ({
          price: prev.price,
          rating: prev.rating,
        }));
      } else {
        setExpanded({
          price: false,
          rating: false,
        });
      }
    };

    // Call it once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  //get widhlisted items
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlistApi();
        const productIds = new Set(
          response.data.wishlist?.products?.map((product) => product._id) || []
        );
        setWishlistedItems(productIds);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  const handleWishlist = async (e, productId) => {
    e.preventDefault();

    if (user.role !== "buyer") {
      toast({
        title: "You are not logged in",
        description: "Please login as a buyer to save products",
        variant: "destructive",
      });
      return;
    }

    try {
      if (wishlistedItems.has(productId)) {
        await removeFromWishlistApi(productId);
        setWishlistedItems((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast({
          title: "Removed from wishlist",
          description: "Product removed from your saved list",
        });
      } else {
        await addToWishlistApi({ productId });
        setWishlistedItems((prev) => new Set([...prev, productId]));
        toast({
          title: "Added to wishlist",
          description: "Product saved to your list",
        });
      }

      // Get updated wishlist count
      const countResponse = await getWishlistCountApi();
      dispatch(setWishlistCount(countResponse.data.count));
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  //getting products
  async function fetchProducts() {
    try {
      setIsLoading(true);
      const response = await getShopProductsApi(searchParams);
      const { products, totalProducts, totalPages, currentPage } =
        response.data;

      setProducts(products);
      setTotalProducts(totalProducts);
      setStartIndex((currentPage - 1) * ITEMS_PER_PAGE);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      toast({
        title: "Error fetching products",
        description: error.response.data.message,
        variant: "destructive",
      });
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  }
  // useEffect to fetch products on page load
  useEffect(() => {
    fetchProducts();
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
    setTempRating(checked ? rating.toString() : null);
  };
  //get category path or breadcrumbs
  const findCategoryPath = (categoryId) => {
    const path = [];

    // Add null checks
    if (!categories || !categoryId) return path;

    for (const category of categories) {
      // Check if subCategories exists
      if (!category.subCategories) continue;

      for (const subCategory of category.subCategories) {
        // First check if this is the subCategory we're looking for
        if (subCategory._id === categoryId) {
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

        // Check if subSubCategories exists
        if (!subCategory.subSubCategories) continue;

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

    return path;
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
    if (tempRating) {
      newParams.set("rating", tempRating);
    } else {
      newParams.delete("rating");
    }
    setSelectedRating(tempRating);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    // Reset to default values
    setPriceRange([0, 10000]);
    setTempRating(null);
    setSelectedRating(null);
    setSortOption("latest");
    setCurrentPage(1);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("priceRange", "0,3000");
    newParams.set("sort", "latest");
    newParams.set("page", "1");
    newParams.delete("rating"); // Always remove rating parameter on reset
    setSearchParams(newParams);
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
                    <Link
                      to={`/shop?category=${category.id}`}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {category.name}
                    </Link>
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
            className="mb-6 space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-0 h-auto"
              >
                <h3 className="font-semibold text-lg">Price Range</h3>
                {expanded.price ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="px-2 pt-4">
                <div className="flex items-center gap-4 mb-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= priceRange[1]) {
                        setPriceRange([value, priceRange[1]]);
                      }
                    }}
                    className="w-24 px-2 py-1 border rounded-md"
                    min={0}
                    max={priceRange[1]}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= priceRange[0]) {
                        setPriceRange([priceRange[0], value]);
                      }
                    }}
                    className="w-24 px-2 py-1 border rounded-md"
                    min={priceRange[0]}
                    max={10000}
                  />
                </div>
                <Slider
                  defaultValue={[0, 10000]}
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value);
                  }}
                  className="mb-4"
                  minStepsBetweenThumbs={1}
                />
                <div className="flex items-center justify-between text-sm">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
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
            className="mb-6 space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-0 h-auto"
              >
                <h3 className="font-semibold text-lg">Ratings</h3>
                {expanded.rating ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={tempRating === rating.toString()}
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
              // Loading state
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : products.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your filters or search term
                </p>
              </div>
            ) : (
              // Products display
              products.map((product) => (
                <div key={product._id} className="group">
                  <Link
                    to={`/product/${product.slug}?id=${product._id}`}
                    className="block"
                  >
                    <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden mb-4">
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                      />

                      {/* wishlist buttomn */}
                      <button
                        onClick={(e) => handleWishlist(e, product._id)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            wishlistedItems.has(product._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>

                      <div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Sheet>
                          <SheetTrigger disabled={!product.inStock}>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={!product.inStock}
                              className={
                                !product.inStock
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }
                            >
                              Add to Cart
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-[500px] flex flex-col h-full">
                            <SheetHeader className="flex-none">
                              <SheetTitle>Add to Cart</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 flex-1 overflow-y-auto">
                              <ProductPurchaseCard
                                product={product}
                                mode="cart"
                              />
                            </div>
                          </SheetContent>
                        </Sheet>

                        <Sheet>
                          <SheetTrigger disabled={!product.inStock}>
                            <Button
                              size="sm"
                              disabled={!product.inStock}
                              className={
                                !product.inStock
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }
                            >
                              Buy Now
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-[500px] flex flex-col h-full">
                            <SheetHeader className="flex-none">
                              <SheetTitle>Buy Now</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 flex-1 overflow-y-auto">
                              <ProductPurchaseCard
                                product={product}
                                mode="buy"
                              />
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      {/* Product Name */}
                      <h3 className="font-medium text-sm line-clamp-2">
                        {product.productName}
                      </h3>

                      {/* Category & Seller */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{product.category.name}</span>
                        <span>{product.seller.sellerName}</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4"
                              fill={
                                i < product.avgRating ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Price & Stock */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            ₹{product.basePrice.toLocaleString()}
                          </span>
                          {product.bulkDiscount.length > 1 && (
                            <span className="text-xs text-green-600 font-medium">
                              Bulk discounts available
                            </span>
                          )}
                        </div>
                        {product.inStock ? (
                          <span className="text-xs text-green-600">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-red-600">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Variants Summary */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Available in{" "}
                          {
                            new Set(
                              product.variants.map(
                                (v) => Object.values(v.attributes[0])[0]
                              )
                            ).size
                          }{" "}
                          colors,{" "}
                          {
                            new Set(
                              product.variants.map(
                                (v) => Object.values(v.attributes[0])[1]
                              )
                            ).size
                          }{" "}
                          sizes
                        </div>
                      )}
                    </div>
                  </Link>
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
