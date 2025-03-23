import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import ProductDialogs from "../../components/Product/ProductDialog";
import {
  getSellerProductsApi,
  sellerAddProductApi,
  sellerDeleteProductApi,
  sellerEditProductApi,
} from "../../api/productApi";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

const initialProducts = [];

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [expandedProducts, setExpandedProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage] = useState(5);

  const { categories } = useSelector((store) => store.categories);

  const fetchSellerProducts = async (applyFilters = false) => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(applyFilters && {
          status: selectedStatus,
          search: searchQuery,
          sortBy: sortBy,
        }),
      };

      const response = await getSellerProductsApi(params);
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching seller products", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchSellerProducts(true);
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSearchQuery("");
    setSortBy("latest");
    setCurrentPage(1);
    fetchSellerProducts();
  };

  // Toggle accordion state
  const toggleAccordion = (productId) => {
    setExpandedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };


  //function to pass to add products
  const handleAddProduct = useCallback(async (data) => {
    try {
      const response = await sellerAddProductApi(data);
      if (response.data) {
        toast({
          title: " Success",
          description: "You just successfully added a new product!",
          variant: "default",
        });
        fetchSellerProducts();
      }
    } catch (error) {
      console.log("Error handling add product: ", error);
      toast({
        title: "Add Product Error",
        description: error,
        variant: "destructive",
      });
    }
  }, []);

  const handleEditProduct = useCallback(
    async (data) => {
      try {
        const response = await sellerEditProductApi(data, selectedProduct._id);
        if (response.data) {
          toast({
            title: "Success",
            description: "Product updated successfully!",
            variant: "default",
          });
          // Refresh the products list
          const updatedProducts = await getSellerProductsApi();
          setProducts(updatedProducts.data.products);
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.log("Error handling edit product: ", error);
        toast({
          title: "Edit Product Error",
          description:
            error.response?.data?.message || "Failed to update product",
          variant: "destructive",
        });
      }
    },
    [selectedProduct]
  );

  const handleDeleteProduct = async (id) => {
    try {
      const response = await sellerDeleteProductApi(id);
      if (response.data) {
        toast({
          title: "Success",
          description: "Product updated successfully!",
          variant: "default",
        });
        // Refresh the products list
        const updatedProducts = await getSellerProductsApi();
        setProducts(updatedProducts.data.products);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.log("Error handling edit product: ", error);
      toast({
        title: "Edit Product Error",
        description:
          error.response?.data?.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleRestoreProduct = async (id) => {
    handleDeleteProduct(id);
  };

  const handleOpenDialog = (type, product = null) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // too many nested if in div is moved here to make the badge for status
  const getStockStatusBadge = (product) => {
    if (!product.isActive) {
      return (
        <Badge variant="outline" className="bg-gray-200 text-gray-700">
          Inactive
        </Badge>
      );
    } else if (!product.inStock) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (product.stock <= 10) {
      return (
        <Badge variant="warning" className="bg-yellow-500">
          Low Stock
        </Badge>
      );
    } else {
      return (
        <Badge variant="success" className="bg-green-500">
          In Stock
        </Badge>
      );
    }
  };

  // Format price from cents to dollars

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button
          className="bg-primary text-white"
          onClick={() => handleOpenDialog("create")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
        {/* Sort By Filter */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Sort By</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {sortBy === "latest" && "Latest"}
                {sortBy === "az" && "A-Z"}
                {sortBy === "za" && "Z-A"}
                {sortBy === "price-high" && "Price: High to Low"}
                {sortBy === "price-low" && "Price: Low to High"}
                {sortBy === "sales" && "Best Selling"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSortBy("latest")}>
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("az")}>
                <ArrowDownAZ className="mr-2 h-4 w-4" /> A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("za")}>
                <ArrowUpAZ className="mr-2 h-4 w-4" /> Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("sales")}>
                Best Selling
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>

        {/* Status Filter */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Status</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedStatus === "all" && "All"}
                {selectedStatus === "active" && "Active"}
                {selectedStatus === "inactive" && "Inactive"}
                {selectedStatus === "in-stock" && "In Stock"}
                {selectedStatus === "out-of-stock" && "Out of Stock"}
                {selectedStatus === "low-stock" && "Low Stock"}
                {selectedStatus === "deleted" && "Deleted"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("in-stock")}>
                In Stock
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus("out-of-stock")}
              >
                Out of Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("low-stock")}>
                Low Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("deleted")}>
                Deleted
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>

        {/* Search */}
        <Card className="p-4 md:col-span-1 sm:col-span-2">
          <h2 className="font-semibold mb-2">Search Products</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 justify-end items-center md:col-span-1 sm:col-span-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Products Table with Accordion to shoew the nested varaints*/}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 w-10"></th>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Product Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                // if no products
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    No products found. Try adjusting your filters or add a new
                    product.
                  </td>
                </tr>
              ) : (
                //loop to show producs
                products.map((product) => (
                  <React.Fragment key={product._id}>
                    <tr
                      className={`border-b hover:bg-gray-50 ${
                        !product.isActive ? "opacity-60" : ""
                      }`}
                    >
                      {/* if inactive show dim row */}
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-8 w-8"
                          onClick={() => toggleAccordion(product._id)}
                        >
                          {expandedProducts.includes(product._id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </Button>
                      </td>
                      <td className="p-3">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="p-3">{product.productName}</td>
                      <td className="p-3">₹{product.basePrice}</td>
                      <td className="p-3">{product.stock}</td>
                      <td className="p-3">{getStockStatusBadge(product)}</td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog("edit", product)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        {product.isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600"
                            onClick={() => handleRestoreProduct(product._id)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Restore
                          </Button>
                        )}
                      </td>
                    </tr>
                    {/* Variants Accordion Content */}
                    {expandedProducts.includes(product._id) &&
                      product.variants && (
                        <tr>
                          <td colSpan={8} className="p-0 border-b">
                            <div className="bg-gray-50 p-4">
                              <h3 className="font-medium text-sm mb-3">
                                Variants
                              </h3>

                              {/* info about the vaiants */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b bg-gray-100">
                                      <th className="text-left p-2">
                                        Attributes
                                      </th>
                                      <th className="text-left p-2">Price</th>
                                      <th className="text-left p-2">Stock</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {product.variants &&
                                    product.variants.length > 0 ? (
                                      product.variants.map((variant) => (
                                        <tr
                                          key={variant.variantId}
                                          className="border-b"
                                        >
                                          <td className="p-2">
                                            {variant.attributes &&
                                              variant.attributes.length > 0 &&
                                              Object.entries(
                                                variant.attributes[0]
                                              ).map(([key, value]) => (
                                                <span
                                                  key={`${key}-${value}`}
                                                  className="mr-2"
                                                >
                                                  <span className="font-medium">
                                                    {key}:
                                                  </span>{" "}
                                                  {value}
                                                </span>
                                              ))}
                                          </td>
                                          <td className="p-2">
                                            ₹{variant.basePrice}
                                          </td>
                                          <td className="p-2">
                                            {variant.stock}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={5}
                                          className="p-2 text-center text-gray-500"
                                        >
                                          No variants found for this product.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Bulk Discount Section */}
                              {product.bulkDiscount &&
                                product.bulkDiscount.length > 0 && (
                                  <div className="mt-4">
                                    <h3 className="font-medium text-sm mb-3">
                                      Bulk Discounts
                                    </h3>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b bg-gray-100">
                                          <th className="text-left p-2">
                                            Minimum Quantity
                                          </th>
                                          <th className="text-left p-2">
                                            Discount Per Unit
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {product.bulkDiscount.map(
                                          (discount, index) => (
                                            <tr
                                              key={index}
                                              className="border-b"
                                            >
                                              <td className="p-2">
                                                {discount.minQty}+
                                              </td>
                                              <td className="p-2">
                                                {discount.priceDiscountPerUnit >
                                                0
                                                  ? `${discount.priceDiscountPerUnit}%`
                                                  : "No discount"}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-sm text-gray-500">
          Showing {products.length} of {totalPages * itemsPerPage} products
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Product Dialogs */}
      <ProductDialogs
        selectedProduct={selectedProduct}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
        categories={categories}
      />
    </div>
  );
}
