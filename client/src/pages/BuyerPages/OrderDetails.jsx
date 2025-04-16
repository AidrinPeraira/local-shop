import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Container } from "../../components/ui/container";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/hooks/use-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getOrderByIdApi,
  cancelOrderApi,
  returnOrderApi,
} from "../../api/orderApi";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { requestReturnApi } from "../../api/returnApi";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const { id } = useParams();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrderByIdApi(id);
      // Check if the response contains the order data
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
        description:
          error.response?.data?.message || "Failed to fetch order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelConfirm = async () => {
    try {
      await cancelOrderApi(id);
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
      setCancelDialogOpen(false);
      fetchOrder();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

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
      if (!returnReason.trim()) {
        toast({
          title: "Error",
          description: "Please provide a return reason",
          variant: "destructive",
        });
        return;
      }

      await requestReturnApi(id, selectedItemId, returnReason);

      toast({
        title: "Success",
        description: "Return request submitted successfully",
      });
      setReturnDialogOpen(false);
      setReturnReason("");
      setSelectedItemId(null);
      fetchOrder(); // Refresh order details
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to submit return request",
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
      case "PENDING":
        return <Clock className="h-5 w-5" />;
      case "PROCESSING":
        return <RefreshCcw className="h-5 w-5" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const generateInvoice = () => {
    const doc = new jsPDF();

    // Add title and header info (unchanged)
    doc.setFontSize(20);
    doc.text("INVOICE", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Order #${order.orderId}`, 14, 36);

    // Customer details section (unchanged)
    const customerData = [
      ["Shipping Address", order.shippingAddress.street],
      ["", `${order.shippingAddress.city}, ${order.shippingAddress.state}`],
      ["", `PIN: ${order.shippingAddress.pincode}`],
      ["", `Phone: ${order.shippingAddress.phone}`],
      ["Payment Method", order.payment.method],
      ["Order Date", formatDate(order.createdAt)],
    ];

    autoTable(doc, {
      startY: 45,
      head: [["Details", "Value"]],
      body: customerData,
      theme: "grid",
      headStyles: { fillColor: [136, 132, 216] },
    });

    // Modified order items table with grouped variants
    const orderItems = order.items.map((item) => {
      // Calculate applicable bulk discount
      const totalQuantity = item.variants.reduce(
        (total, v) => total + v.quantity,
        0
      );
      let discountPercentage = 0;

      if (item.bulkDiscount) {
        const applicableDiscount = [...item.bulkDiscount]
          .sort((a, b) => b.minQty - a.minQty)
          .find((discount) => totalQuantity >= discount.minQty);

        if (applicableDiscount) {
          discountPercentage = applicableDiscount.priceDiscountPerUnit;
        }
      }

      // Create variant details string
      const variantDetails = item.variants
        .map((v) => `${v.attributes} (Qty: ${v.quantity})`)
        .join("\n");

      return [
        item.productName,
        variantDetails,
        totalQuantity,
        discountPercentage > 0 ? `${discountPercentage}%` : "-",
        `Rs. ${item.productTotal}`,
      ];
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Product", "Variants", "Total Qty", "Bulk Discount", "Total"]],
      body: orderItems,
      theme: "grid",
      headStyles: { fillColor: [136, 132, 216] },
      columnStyles: {
        1: { cellWidth: "auto", whiteSpace: "pre-line" },
        3: { halign: "center" },
        4: { halign: "right" },
      },
    });

    // Rest of the code remains the same
    const summaryData = [
      [
        "Subtotal before discount",
        `Rs. ${order.summary.subtotalBeforeDiscount}`,
      ],
      ["Product Discount", `- Rs. ${order.summary.totalDiscount}`],
      ["Subtotal after discount", `Rs. ${order.summary.subtotalAfterDiscount}`],
      ["Coupon Discount", `- Rs. ${order.summary.couponDiscount}`],
      ["Shipping Charge", `Rs. ${order.summary.shippingCharge}`],
      ["Platform Fee", `Rs. ${order.summary.platformFee}`],
      ["Total Amount", `Rs. ${order.summary.cartTotal}`],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Summary", "Amount"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [136, 132, 216] },
    });

    // Footer (unchanged)
    doc.setFontSize(10);
    doc.text("Authorized Signature", 14, doc.lastAutoTable.finalY + 30);
    doc.text(
      "Thank you for shopping with us!",
      doc.internal.pageSize.getWidth() / 2,
      doc.lastAutoTable.finalY + 30,
      { align: "center" }
    );

    doc.save(`invoice-${order.orderId}.pdf`);
  };

  const getReturnStatusBadge = (returnStatus) => {
    if (!returnStatus) return null;

    const statusColors = {
      RETURN_REQUESTED: "bg-yellow-100 text-yellow-800",
      RETURN_APPROVED: "bg-blue-100 text-blue-800",
      RETURN_REJECTED: "bg-red-100 text-red-800",
      RETURN_SHIPPED: "bg-purple-100 text-purple-800",
      RETURN_COMPLETED: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[returnStatus.status]
        }`}
      >
        {returnStatus.status.replace("_", " ")}
      </span>
    );
  };

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case "COD":
        return "Cash on Delivery";
      case "ONLINE":
        return "Online Payment";
      case "WALLET":
        return "Wallet Payment";
      default:
        return method;
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
              <div className="flex items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile/orders")}
                  className="mr-4"
                >
                  ← Back to Orders
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.orderStatus)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
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

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">
                      ₹{order.summary.cartTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span>{order?.payment?.method ? getPaymentMethodDisplay(order.payment.method) : 'N/A'}</span>
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
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.productName}</h3>
                          {item.returnStatus &&
                            getReturnStatusBadge(item.returnStatus)}
                        </div>
                        {item.variants.map((variant) => (
                          <p
                            key={variant.variantId}
                            className="text-sm text-gray-600"
                          >
                            {variant.attributes} - Qty: {variant.quantity}
                          </p>
                        ))}
                        {order.orderStatus === "DELIVERED" &&
                          !item.returnStatus && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setSelectedItemId(item._id);
                                setReturnDialogOpen(true);
                              }}
                            >
                              Return Item
                            </Button>
                          )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.productTotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Price Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal before discount
                    </span>
                    <span>₹{order.summary.subtotalBeforeDiscount}</span>
                  </div>

                  {order.summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Product Discount</span>
                      <span>- ₹{order.summary.totalDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal after discount
                    </span>
                    <span>₹{order.summary.subtotalAfterDiscount}</span>
                  </div>

                  {order.summary.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>- ₹{order.summary.couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Charge</span>
                    <span>₹{order.summary.shippingCharge}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>₹{order.summary.platformFee}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{order.summary.cartTotal}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>PIN: {order.shippingAddress.pincode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={generateInvoice}>
                  Download Invoice
                </Button>
                {(order.orderStatus === "PENDING" ||
                  order.orderStatus === "PROCESSING") && (
                  <Button
                    variant="destructive"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">Order not found</div>
          )}
        </Container>
      </main>

      {/* cancel confirm dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              No, Keep Order
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm}>
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* return reason dialog */}
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
            <Button onClick={handleReturn} disabled={!returnReason.trim()}>
              Submit Return Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
