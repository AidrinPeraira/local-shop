import React, { useEffect, useState } from "react";
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  MapPin,
  ArrowDown,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { getSellerOrdersApi, updateOrderStatusApi } from "../../api/orderApi";


const orderStatuses = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "RETURN-REQUESTED",
  "RETURN-PROCESSING"
];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [appliedStatus, setAppliedStatus] = useState("ALL");
  const [appliedSort, setAppliedSort] = useState("desc");
  const [appliedSearch, setAppliedSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getSellerOrdersApi(
        currentPage,
        6,
        appliedStatus === "ALL" ? "" : appliedStatus,
        appliedSort,
        appliedSearch
      );
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, appliedStatus, appliedSort, appliedSearch]);

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying new filters
    setAppliedStatus(selectedStatus);
    setAppliedSort(sortBy);
    setAppliedSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedStatus("ALL");
    setSortBy("desc");
    setSearchQuery("");
    setCurrentPage(1);
    setAppliedStatus("ALL");
    setAppliedSort("desc");
    setAppliedSearch("");
  };

  const toggleAccordion = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-500",
      PROCESSING: "bg-blue-500",
      SHIPPED: "bg-purple-500",
      DELIVERED: "bg-green-500",
      CANCELLED: "bg-red-500",
      RETURNED: "bg-gray-500",
      "RETURN-REQUESTED": "bg-orange-500",
    };

    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          {/* Status Filter */}
          <div>
            <h2 className="font-semibold mb-2">Order Status</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedStatus}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {orderStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort By */}
          <div>
            <h2 className="font-semibold mb-2">Sort By</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {sortBy === "desc" ? "Latest First" : "Oldest First"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("desc")}>
                  Latest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("asc")}>
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div>
            <h2 className="font-semibold mb-2">Search Orders</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear Filters
          </Button>
          <Button onClick={handleApplyFilters} disabled={loading}>
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 w-10"></th>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8"
                        onClick={() => toggleAccordion(order._id)}
                      >
                        {expandedOrders.includes(order._id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </Button>
                    </td>
                    <td className="p-3">{order.orderId}</td>
                    <td className="p-3">{order.user.name}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">₹{order.summary.cartTotal}</td>
                    <td className="p-3">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={[
                              "DELIVERED",
                              "CANCELLED",
                              "RETURNED",
                            ].includes(order.orderStatus)}
                          >
                            Update Status
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {orderStatuses
                            .filter((status) => status !== "ALL")
                            .map((status) => {
                              const isDisabled = [
                                "DELIVERED",
                                "CANCELLED",
                                "RETURNED",
                              ].includes(order.orderStatus);
                              return (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() =>
                                    !isDisabled &&
                                    handleStatusUpdate(order._id, status)
                                  }
                                  className={`${
                                    isDisabled
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {status}
                                </DropdownMenuItem>
                              );
                            })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>

                  {/* Expanded Order Details */}
                  {expandedOrders.includes(order._id) && (
                    <tr>
                      <td colSpan={7} className="p-0 border-b">
                        <div className="bg-gray-50 p-4 space-y-4">
                          {/* Shipping Address */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium text-sm mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              Shipping Address
                            </h3>
                            <p className="text-sm">
                              {order.shippingAddress.street}
                              <br />
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}
                              <br />
                              PIN: {order.shippingAddress.pincode}
                              <br />
                              Phone: {order.shippingAddress.phone}
                            </p>
                          </div>
                          

                          {/* retunr reason */}
                          {[
                            "RETURN-REQUESTED",
                            "RETURN-PROCESSING",
                            "RETURNED",
                          ].includes(order.orderStatus) && (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h3 className="font-medium text-sm mb-2 flex items-center">
                                <ArrowDown className="h-4 w-4 mr-2" />
                                Return Details
                              </h3>
                              <div className="text-sm">
                                {order.trackingDetails
                                  .filter((detail) =>
                                    [
                                      "RETURN-REQUESTED",
                                      "RETURN-PROCESSING",
                                      "RETURNED",
                                    ].includes(detail.status)
                                  )
                                  .map((detail, index) => (
                                    <div key={index} className="mb-2">
                                      <p className="text-gray-600">
                                        {new Date(
                                          detail.timestamp
                                        ).toLocaleDateString()}{" "}
                                        - {detail.status}
                                      </p>
                                      <p className="mt-1">
                                        {detail.description}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          

                          {/* Order Items */}
                          <div>
                            <h3 className="font-medium text-sm mb-3">
                              Order Items
                            </h3>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="text-left p-2">Product</th>
                                  <th className="text-left p-2">Variant</th>
                                  <th className="text-left p-2">Quantity</th>
                                  <th className="text-left p-2">Price</th>
                                  <th className="text-left p-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) =>
                                  item.variants.map((variant) => (
                                    <tr
                                      key={variant.variantId}
                                      className="border-b"
                                    >
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-10 h-10 object-cover rounded mr-2"
                                          />
                                          {item.productName}
                                        </div>
                                      </td>
                                      <td className="p-2">
                                        {variant.attributes}
                                      </td>
                                      <td className="p-2">
                                        {variant.quantity}
                                      </td>
                                      <td className="p-2">
                                        ₹{variant.basePrice}
                                      </td>
                                      <td className="p-2">
                                        ₹{variant.variantTotal}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Order Summary */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium text-sm mb-2">
                              Order Summary
                            </h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                  ₹{order.summary.subtotalBeforeDiscount}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Discount</span>
                                <span>-₹{order.summary.totalDiscount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{order.summary.shippingCharge}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>₹{order.summary.platformFee}</span>
                              </div>
                             
                              <div className="flex justify-between font-medium pt-2 border-t">
                                <span>Total</span>
                                <span>₹{order.summary.cartTotal}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
