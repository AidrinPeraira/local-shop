
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { AlertCircle, ShoppingBag, TruckIcon, Package, CheckCircle, Clock } from "lucide-react";
import { toast } from "../hooks/use-toast";



const OrdersSection = ({ orders, onCancelOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };
  
  const handleCancelOrder = () => {
    if (selectedOrder) {
      setIsCancelDialogOpen(false);
      
      // Call the parent handler
      onCancelOrder(selectedOrder.id);
      
      toast({
        title: "Order Cancelled",
        description: `Order #${selectedOrder.id} has been cancelled.`
      });
    }
  };
  
  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setIsCancelDialogOpen(true);
  };

  // Helper to render status badge with appropriate color
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500"><TruckIcon className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <ShoppingBag className="mr-2 h-5 w-5" />
        <h2 className="text-2xl font-semibold">My Orders</h2>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {formatDate(order.date)}</CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-sm">Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewOrder(order)}
                  className="flex items-center gap-1"
                >
                  View Details
                </Button>
                
                {order.canCancel && (
                  <Button 
                    variant="outline" 
                    onClick={() => openCancelDialog(order)}
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    Cancel Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={(open) => setIsOrderDetailOpen(open)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && formatDate(selectedOrder.date)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                  <TableCell className="text-right font-bold">{selectedOrder && formatCurrency(selectedOrder.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            {selectedOrder?.trackingNumber && (
              <div className="flex items-center p-3 bg-blue-50 rounded-md text-blue-700">
                <Package className="h-4 w-4 mr-2" />
                <span>Tracking Number: {selectedOrder.trackingNumber}</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOrderDetailOpen(false)}
            >
              Close
            </Button>
            {selectedOrder?.canCancel && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsOrderDetailOpen(false);
                  openCancelDialog(selectedOrder);
                }}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Cancel Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={(open) => setIsCancelDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel order #{selectedOrder?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center p-3 bg-amber-50 rounded-md text-amber-700 mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Orders that have shipped may still be delivered.</span>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Go Back
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersSection;
