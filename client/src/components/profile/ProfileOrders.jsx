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
import { useNavigate } from "react-router-dom";
import { loadScript } from "../../utils/loadScript";
import { razorPayKey } from "../../configuration";
import { createRazorpayOrderApi, verifyRazorpayPaymentApi, updateOrderPaymentStatusApi } from "../../api/orderApi";

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
  const navigate = useNavigate();


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
  }, [page, sort, search]);1

  const handleRetryPayment = async (order) => {
    try {
      // Initialize Razorpay
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast({
          title: "Error",
          description: "Razorpay SDK failed to load",
          variant: "destructive",
        });
        return;
      }
  
      // Create new Razorpay order
      const orderResponse = await createRazorpayOrderApi({
        amount: order.summary.cartTotal,
      });
  
      const options = {
        key: razorPayKey,
        amount: orderResponse.data.order.amount,
        currency: "INR",
        name: "Local Shop",
        description: "Payment retry for order " + order.orderId,
        order_id: orderResponse.data.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await verifyRazorpayPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
  
            // Update order payment status
            await updateOrderPaymentStatusApi(order._id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
  
            toast({
              title: "Success",
              description: "Payment completed successfully",
            });
  
            // Refresh orders list
            fetchOrders();
          } catch (error) {
            toast({
              title: "Error",
              description: "Payment verification failed",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Info",
              description: "Payment cancelled",
            });
          },
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment retry",
        variant: "destructive",
      });
    }
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
                  <div className="flex gap-2">
                    {order.payment.status === "FAILED" && (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Payment Failed
                      </span>
                    )}
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
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate(`/profile/orders/${order._id}`)}
                >
                  View Details
                </Button>
                {order.payment.status === "FAILED" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleRetryPayment(order)}
                    >
                      Retry Payment
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
    </div>
  );
};

export default ProfileOrders;
