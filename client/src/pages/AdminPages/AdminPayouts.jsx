import React, { useState, useEffect } from 'react';
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
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
  IndianRupee,
  Filter,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { 
    getVendorPayoutsApi, 
    getBuyerRefundsApi,
    processVendorPayoutApi,
    processBuyerRefundApi 
  } from "../../api/payoutApi";

const AdminPayouts = () => {
  // States for vendor payouts
  const [vendorPayouts, setVendorPayouts] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorFilter, setVendorFilter] = useState({
    status: "PENDING",
    dateRange: "all",
    search: "",
    page: 1
  });

  // States for buyer refunds
  const [buyerRefunds, setBuyerRefunds] = useState([]);
  const [selectedRefunds, setSelectedRefunds] = useState([]);
  const [refundFilter, setRefundFilter] = useState({
    status: "PENDING",
    dateRange: "all",
    search: "",
    page: 1
  });

  const { toast } = useToast();

  const [vendorLoading, setVendorLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [vendorTotalPages, setVendorTotalPages] = useState(1);
  const [refundTotalPages, setRefundTotalPages] = useState(1);

  // Fetch vendor payouts
  const fetchVendorPayouts = async () => {
    try {
      setVendorLoading(true);
      const params = {
        page: vendorFilter.page,
        limit: 10,
        status: vendorFilter.status,
        search: vendorFilter.search,
        dateRange: vendorFilter.dateRange
      };

      const { data } = await getVendorPayoutsApi(params);
      
      if (data.success) {
        setVendorPayouts(data.payouts);
        setVendorTotalPages(data.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch vendor payouts",
        variant: "destructive",
      });
    } finally {
      setVendorLoading(false);
    }
  };

  // Fetch buyer refunds
  const fetchBuyerRefunds = async () => {
    try {
      setRefundLoading(true);
      const params = {
        page: refundFilter.page,
        limit: 10,
        status: refundFilter.status,
        search: refundFilter.search,
        dateRange: refundFilter.dateRange
      };

      const { data } = await getBuyerRefundsApi(params);
      
      if (data.success) {
        setBuyerRefunds(data.refunds);
        setRefundTotalPages(data.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch buyer refunds",
        variant: "destructive",
      });
    } finally {
      setRefundLoading(false);
    }
  };

  // Process vendor payouts
  const processVendorPayouts = async () => {
    try {
      const { data } = await processVendorPayoutApi(selectedVendors);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Vendor payouts processed successfully",
        });
        fetchVendorPayouts(); // Refresh the list
        setSelectedVendors([]); // Clear selection
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process vendor payouts",
        variant: "destructive",
      });
    }
  };

  // Process buyer refunds
  const processBuyerRefunds = async () => {
    try {
      const { data } = await processBuyerRefundApi(selectedRefunds);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Buyer refunds processed successfully",
        });
        fetchBuyerRefunds(); // Refresh the list
        setSelectedRefunds([]); // Clear selection
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process buyer refunds",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVendorPayouts();
  }, [vendorFilter]);

  useEffect(() => {
    fetchBuyerRefunds();
  }, [refundFilter]);

  const renderVendorRows = () => (
    vendorPayouts.map((payout) => (
      <tr key={payout._id} className="border-b hover:bg-gray-50">
        <td className="p-3">
          <input
            type="checkbox"
            checked={selectedVendors.includes(payout._id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedVendors([...selectedVendors, payout._id]);
              } else {
                setSelectedVendors(selectedVendors.filter(id => id !== payout._id));
              }
            }}
          />
        </td>
        <td className="p-3">{payout.vendor.name}</td>
        <td className="p-3">₹{payout.amount}</td>
        <td className="p-3">{payout.orderCount}</td>
        <td className="p-3">
          <Badge variant={payout.status === "PENDING" ? "warning" : 
                         payout.status === "PROCESSING" ? "info" : "success"}>
            {payout.status}
          </Badge>
        </td>
        <td className="p-3">{payout.bankDetails}</td>
        <td className="p-3">
          <Button
            variant="outline"
            size="sm"
            disabled={payout.status === "COMPLETED"}
            onClick={() => handleProcessSinglePayout(payout._id)}
          >
            Process
          </Button>
        </td>
      </tr>
    ))
  );

  const renderRefundRows = () => (
    buyerRefunds.map((refund) => (
      <tr key={refund._id} className="border-b hover:bg-gray-50">
        <td className="p-3">
          <input
            type="checkbox"
            checked={selectedRefunds.includes(refund._id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRefunds([...selectedRefunds, refund._id]);
              } else {
                setSelectedRefunds(selectedRefunds.filter(id => id !== refund._id));
              }
            }}
          />
        </td>
        <td className="p-3">{refund.orderId}</td>
        <td className="p-3">{refund.buyer.name}</td>
        <td className="p-3">₹{refund.amount}</td>
        <td className="p-3">{refund.reason}</td>
        <td className="p-3">
          <Badge variant={refund.status === "PENDING" ? "warning" : 
                         refund.status === "PROCESSING" ? "info" : "success"}>
            {refund.status}
          </Badge>
        </td>
        <td className="p-3">{refund.paymentMethod}</td>
        <td className="p-3">
          <Button
            variant="outline"
            size="sm"
            disabled={refund.status === "COMPLETED"}
            onClick={() => handleProcessSingleRefund(refund._id)}
          >
            Process
          </Button>
        </td>
      </tr>
    ))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Management</h1>

      <Tabs defaultValue="vendor-payouts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vendor-payouts">Vendor Payouts</TabsTrigger>
          <TabsTrigger value="buyer-refunds">Buyer Refunds</TabsTrigger>
        </TabsList>

        {/* Vendor Payouts Tab */}
        <TabsContent value="vendor-payouts">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Status: {vendorFilter.status}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setVendorFilter({ ...vendorFilter, status: "PENDING" })}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVendorFilter({ ...vendorFilter, status: "PROCESSING" })}>
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVendorFilter({ ...vendorFilter, status: "COMPLETED" })}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Input
                  placeholder="Search vendor..."
                  value={vendorFilter.search}
                  onChange={(e) => setVendorFilter({ ...vendorFilter, search: e.target.value })}
                  className="w-64"
                />
              </div>

              <Button
                onClick={processVendorPayouts}
                disabled={selectedVendors.length === 0}
              >
                Process Selected Payouts
              </Button>
            </div>

            {/* Vendor Payouts Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVendors(vendorPayouts.map(p => p.id));
                          } else {
                            setSelectedVendors([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-3">Vendor</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Orders</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Bank Details</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Vendor payout rows will be mapped here */}
                  {renderVendorRows()}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Buyer Refunds Tab */}
        <TabsContent value="buyer-refunds">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Status: {refundFilter.status}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setRefundFilter({ ...refundFilter, status: "PENDING" })}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRefundFilter({ ...refundFilter, status: "PROCESSING" })}>
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRefundFilter({ ...refundFilter, status: "COMPLETED" })}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Input
                  placeholder="Search order ID or buyer..."
                  value={refundFilter.search}
                  onChange={(e) => setRefundFilter({ ...refundFilter, search: e.target.value })}
                  className="w-64"
                />
              </div>

              <Button
                onClick={processBuyerRefunds}
                disabled={selectedRefunds.length === 0}
              >
                Process Selected Refunds
              </Button>
            </div>

            {/* Buyer Refunds Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRefunds(buyerRefunds.map(r => r.id));
                          } else {
                            setSelectedRefunds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Buyer</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Reason</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Payment Method</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Buyer refund rows will be mapped here */}
                  {renderRefundRows()}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayouts;