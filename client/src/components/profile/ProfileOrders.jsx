import React, { useState, useEffect } from "react";
import { getUserOrdersApi, cancelOrderApi, returnOrderApi } from "../../api/orderApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/hooks/use-toast";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCcw,
} from "lucide-react";

const OrderTimeline = ({ status, trackingDetails }) => {
  const statusSteps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = statusSteps.indexOf(status);

  return (
    <div className="flex items-center space-x-4 py-4">
      {statusSteps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              {index === 0 && <Clock className="w-4 h-4" />}
              {index === 1 && <RefreshCcw className="w-4 h-4" />}
              {index === 2 && <Truck className="w-4 h-4" />}
              {index === 3 && <CheckCircle className="w-4 h-4" />}
            </div>
            <span className="text-xs mt-1">{step}</span>
          </div>
          {index < statusSteps.length - 1 && (
            <div
              className={`h-0.5 flex-1 ${
                index < currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getUserOrdersApi(page, 5, sort, search);
      setOrders(response.data.orders);
      setTotalPages(Math.ceil(response.data.total / 5));
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
  }, [page, sort, search]);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrderApi(orderId);
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async (orderId) => {
    try {
      await returnOrderApi(orderId, returnReason);
      toast({
        title: "Success",
        description: "Return request submitted successfully",
      });
      setReturnDialogOpen(false);
      setReturnReason("");
      setSelectedOrderId(null);
      fetchOrders();
    } catch (error) {
      console.log("retunr error", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit return request",
        variant: "destructive",
      });
    }
  };
  const openReturnDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setReturnDialogOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No orders found</h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {orders.map((order) => (
            <AccordionItem
              key={order._id}
              value={order._id}
              className="border rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">Order #{order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    ₹{order.summary.cartTotal}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <OrderTimeline
                  status={order.orderStatus}
                  trackingDetails={order.trackingDetails}
                />
                <div className="space-y-4 mt-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 border-b pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        {item.variants.map((variant) => (
                          <p
                            key={variant.variantId}
                            className="text-sm text-gray-600"
                          >
                            {variant.attributes} - Qty: {variant.quantity}
                          </p>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.productTotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {(order.orderStatus === "PENDING" ||
                  order.orderStatus === "PROCESSING") && (
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
                {order.orderStatus === "DELIVERED" && (
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => openReturnDialog(order._id)}
                >
                  Return Order
                </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2 border rounded">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Please provide a reason for return
            </label>
            <Textarea
              placeholder="Enter return reason..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReturnDialogOpen(false);
                setReturnReason("");
                setSelectedOrderId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReturn(selectedOrderId)}
              disabled={!returnReason.trim()}
            >
              Submit Return Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileOrders;
