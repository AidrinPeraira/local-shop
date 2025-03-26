import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Container } from '../../components/ui/container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/hooks/use-toast';
import { getOrderByIdApi, cancelOrderApi, returnOrderApi } from '../../api/orderApi';
import { Package, Truck, CheckCircle, XCircle, Clock, RefreshCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const { id } = useParams();
  const { toast } = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrderByIdApi(id);
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    try {
      await cancelOrderApi(id);
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
      fetchOrder();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async () => {
    try {
      await returnOrderApi(id, returnReason);
      toast({
        title: "Success",
        description: "Return request submitted successfully",
      });
      setReturnDialogOpen(false);
      setReturnReason("");
      fetchOrder();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit return request",
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <Clock className="h-5 w-5" />;
      case "PROCESSING": return <RefreshCcw className="h-5 w-5" />;
      case "SHIPPED": return <Truck className="h-5 w-5" />;
      case "DELIVERED": return <CheckCircle className="h-5 w-5" />;
      case "CANCELLED": return <XCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-10">
        <Container>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : order ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.orderStatus)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${order.orderStatus === "DELIVERED" ? "bg-green-100 text-green-800" :
                    order.orderStatus === "CANCELLED" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">₹{order.summary.cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{order.payment.method}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        {item.variants.map((variant) => (
                          <p key={variant.variantId} className="text-sm text-gray-600">
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
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>PIN: {order.shippingAddress.pincode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </Card>

              <div className="flex gap-4">
                {(order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING") && (
                  <Button variant="destructive" onClick={handleCancel}>
                    Cancel Order
                  </Button>
                )}
                {order.orderStatus === "DELIVERED" && (
                  <Button variant="secondary" onClick={() => setReturnDialogOpen(true)}>
                    Return Order
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">Order not found</div>
          )}
        </Container>
      </main>

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
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReturn}
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

export default OrderDetails;