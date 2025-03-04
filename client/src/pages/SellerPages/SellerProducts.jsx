import { useCallback, useState } from "react";
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
import { sellerAddProduct } from "../../api/productApi";
import { useSelector } from 'react-redux'

// Mock product data with extended details and variants
const initialProducts = [
  { 
    id: 1, 
    name: "Gaming Mouse", 
    price: "$59.99", 
    stock: 25, 
    sales: 150, 
    category: "electronics",
    description: "High-precision gaming mouse with RGB lighting and programmable buttons.",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 0 },
      { id: "2", url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 1 },
      { id: "3", url: "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 2 },
    ],
    isDeleted: false,
    active: true,
    variants: [
      { id: 101, name: "Black", sku: "GM-BLK", stock: 15, price: "$59.99" },
      { id: 102, name: "White", sku: "GM-WHT", stock: 10, price: "$59.99" }
    ]
  },
  { 
    id: 2, 
    name: "Mechanical Keyboard", 
    price: "$129.99", 
    stock: 15, 
    sales: 80, 
    category: "electronics",
    description: "Mechanical keyboard with blue switches and customizable RGB lighting.",
    images: [
      { id: "4", url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 0 },
      { id: "5", url: "https://images.unsplash.com/photo-1595225476474-63bd911e074f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 1 },
      { id: "6", url: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 2 },
    ],
    isDeleted: false,
    active: true,
    variants: [
      { id: 201, name: "Blue Switches", sku: "KB-BLU", stock: 8, price: "$129.99" },
      { id: 202, name: "Red Switches", sku: "KB-RED", stock: 7, price: "$134.99" }
    ]
  },
  { 
    id: 3, 
    name: "Gaming Headset", 
    price: "$89.99", 
    stock: 30, 
    sales: 200, 
    category: "electronics",
    description: "Immersive gaming headset with surround sound and noise-cancelling microphone.",
    images: [
      { id: "7", url: "https://images.unsplash.com/photo-1606993899362-f61aa9f8c9c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 0 },
      { id: "8", url: "https://images.unsplash.com/photo-1578319439584-104c94d37305?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 1 },
      { id: "9", url: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 2 },
    ],
    isDeleted: false,
    active: false,
    variants: [
      { id: 301, name: "Wired", sku: "GH-WRD", stock: 20, price: "$89.99" },
      { id: 302, name: "Wireless", sku: "GH-WLS", stock: 10, price: "$109.99" }
    ]
  },
  { 
    id: 4, 
    name: "Mousepad XL", 
    price: "$19.99", 
    stock: 50, 
    sales: 300, 
    category: "electronics",
    description: "Extra large mousepad with stitched edges and non-slip rubber base.",
    images: [
      { id: "10", url: "https://images.unsplash.com/photo-1616044543567-1307dd14e159?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 0 },
      { id: "11", url: "https://images.unsplash.com/photo-1606831091354-63f5e1243409?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 1 },
      { id: "12", url: "https://images.unsplash.com/photo-1618441517082-0321b3dac1dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 2 },
    ],
    isDeleted: false,
    active: true,
    variants: [
      { id: 401, name: "Black", sku: "MP-BLK", stock: 30, price: "$19.99" },
      { id: 402, name: "Gray", sku: "MP-GRY", stock: 20, price: "$19.99" }
    ]
  },
  { 
    id: 5, 
    name: "Gaming Chair", 
    price: "$299.99", 
    stock: 10, 
    sales: 45, 
    category: "furniture",
    description: "Ergonomic gaming chair with adjustable armrests and lumbar support.",
    images: [
      { id: "13", url: "https://images.unsplash.com/photo-1631206754156-257ee2e89642?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 0 },
      { id: "14", url: "https://images.unsplash.com/photo-1636456963489-dec29cf031dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 1 },
      { id: "15", url: "https://images.unsplash.com/photo-1669302583159-73855cf60f12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", order: 2 },
    ],
    isDeleted: false,
    active: true,
    variants: [
      { id: 501, name: "Black", sku: "GC-BLK", stock: 5, price: "$299.99" },
      { id: 502, name: "Red", sku: "GC-RED", stock: 5, price: "$299.99" }
    ]
  },
];

export default function SellerProducts() {

  
  const [products, setProducts] = useState(initialProducts);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [expandedProducts, setExpandedProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();
    
  const {categories} = useSelector(store => store.categories) 

  // Toggle accordion
  const toggleAccordion = (productId) => {
    setExpandedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Filter products based on status and search query
  

  //filtering based on criteria selected by th eseller
  const filteredProducts = products.filter(product => {
    
    
    if (selectedStatus === "in-stock" && product.stock <= 0) return false;
    if (selectedStatus === "out-of-stock" && product.stock > 0) return false;
    if (selectedStatus === "low-stock" && (product.stock > 10 || product.stock <= 0)) return false;
    if (selectedStatus === "deleted" && !product.isDeleted) return false;
    if (selectedStatus === "active" && (!product.active || product.isDeleted)) return false;
    if (selectedStatus === "inactive" && (product.active || product.isDeleted)) return false;
    if (selectedStatus !== "deleted" && product.isDeleted) return false;

    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(query);
    }

    return true;
  });

  // Sorting the  filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "price-high":
        return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
      case "price-low":
        return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
      case "sales":
        return b.sales - a.sales;
      case "latest":
      default:
        return b.id - a.id;
    }
  });


  const handleAddProduct = useCallback(async (data) => {
    console.log("this is the data sent to the backen",data)
    try {
      const response = await sellerAddProduct(data)
      console.log(response.data)
    } catch (error) {
      
    }
  }, [])
  const handleEditProduct = useCallback((data) => {
    console.log(data)
  }, [])
  
 
  const handleOpenDialog = (type, product = null) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  // Generate stock status badge for a product
  const getStockStatusBadge = (product) => {
    if (product.isDeleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    } else if (!product.active) {
      return <Badge variant="outline" className="bg-gray-200 text-gray-700">Inactive</Badge>;
    } else if (product.stock <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (product.stock <= 10) {
      return <Badge variant="warning" className="bg-yellow-500">Low Stock</Badge>;
    } else {
      return <Badge variant="success" className="bg-green-500">In Stock</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button 
          className="bg-primary text-white" 
          onClick={() => handleOpenDialog('create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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

        {/* Status Filter - Fixed */}
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
              <DropdownMenuItem onClick={() => setSelectedStatus("out-of-stock")}>
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
        <Card className="p-4 md:col-span-2">
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
      </div>

      {/* Products Table with Accordion */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 w-10"></th>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Total Sales</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    No products found. Try adjusting your filters or add a new product.
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
                  <>
                    <tr key={product.id} className={`border-b hover:bg-gray-50 ${product.isDeleted ? 'opacity-60' : ''}`}>
                      <td className="p-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8"
                          onClick={() => toggleAccordion(product.id)}
                        >
                          {expandedProducts.includes(product.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </Button>
                      </td>
                      <td className="p-3">
                        {product.images && product.images.length > 0 && (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.price}</td>
                      <td className="p-3">{product.stock}</td>
                      <td className="p-3">{getStockStatusBadge(product)}</td>
                      <td className="p-3">{product.sales}</td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog("edit", product)}
                          disabled={product.isDeleted}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        {product.isDeleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600"
                            onClick={() => {
                              setProducts(products.map(p => 
                                p.id === product.id ? { ...p, isDeleted: false } : p
                              ));
                              toast({
                                title: "Product Restored",
                                description: `${product.name} has been restored successfully.`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Restore
                          </Button>
                        ) : (
                          <>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600"
                              onClick={() => handleOpenDialog("delete", product)}
                            >
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                    {/* Variants Accordion Content */}
                    {expandedProducts.includes(product.id) && product.variants && (
                      <tr>
                        <td colSpan={8} className="p-0 border-b">
                          <div className="bg-gray-50 p-4">
                            <h3 className="font-medium text-sm mb-3">Variants</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b bg-gray-100">
                                    <th className="text-left p-2">Variant</th>
                                    <th className="text-left p-2">SKU</th>
                                    <th className="text-left p-2">Price</th>
                                    <th className="text-left p-2">Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.variants.length > 0 ? (
                                    product.variants.map((variant) => (
                                      <tr key={variant.id} className="border-b">
                                        <td className="p-2">{variant.name}</td>
                                        <td className="p-2">{variant.sku}</td>
                                        <td className="p-2">{variant.price}</td>
                                        <td className="p-2">{variant.stock}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="p-2 text-center text-gray-500">
                                        No variants found for this product.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

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