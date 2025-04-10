import React, { useState, useEffect } from "react";
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
  processVendorPayoutApi,
} from "../../api/payoutApi";

const AdminPayouts = () => {
  // States for vendor payouts
  const [vendorPayouts, setVendorPayouts] = useState([]);
  const [vendorFilter, setVendorFilter] = useState({
    status: "PENDING",
    dateRange: "all",
    search: "",
    page: 1,
  });
  

  

  // Add date range options
  const dateRangeOptions = [
    { label: "All Time", value: "all" },
    { label: "Last Week", value: "week" },
    { label: "Last Month", value: "month" },
    { label: "Last Year", value: "year" },
  ];

  const { toast } = useToast();

  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorTotalPages, setVendorTotalPages] = useState(1);

  // Fetch vendor payouts
  const fetchVendorPayouts = async () => {
    try {
      setVendorLoading(true);
      const params = {
        page: vendorFilter.page,
        limit: 10,
        status: vendorFilter.status,
        search: vendorFilter.search,
        dateRange: vendorFilter.dateRange,
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

  // Process single vendor payout
  const processSinglePayout = async (orderId, sellerId) => {
    try {
      const { data } = await processVendorPayoutApi({ orderId, sellerId });

      if (data.success) {
        toast({
          title: "Success",
          description: "Vendor payout processed successfully",
        });
        fetchVendorPayouts(); // Refresh the list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process vendor payout",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVendorPayouts();
  }, [vendorFilter]);

  const renderVendorRows = () =>
    vendorPayouts.map((payout) => (
      <tr key={payout._id} className="border-b hover:bg-gray-50">
        <td className="p-3">{payout.vendor.name}</td>
        <td className="p-3">₹{payout.amount.toLocaleString()}</td>
        <td className="p-3">{payout.orderId}</td>
        <td className="p-3">
          <Badge
            variant={
              payout.status === "PENDING"
                ? "warning"
                : payout.status === "PROCESSING"
                ? "info"
                : "success"
            }
          >
            {payout.status}
          </Badge>
        </td>
        <td className="p-3">
          <div className="text-sm">
            <p className="font-medium">{payout.vendor.bankDetails.bankName}</p>
            <p className="text-gray-600">
              A/C: {payout.vendor.bankDetails.accountNumber}
            </p>
            <p className="text-gray-600">
              {payout.vendor.bankDetails.accountHolderName}
            </p>
            <p className="text-gray-500 text-xs">
              IFSC: {payout.vendor.bankDetails.ifscCode}
            </p>
          </div>
        </td>
        <td className="p-3">
          <Button
            variant="outline"
            size="sm"
            disabled={payout.status === "COMPLETED"}
            onClick={() => processSinglePayout(payout._id, payout.vendor._id)}
          >
            Process
          </Button>
        </td>
      </tr>
    ));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendor Payouts</h1>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status: {vendorFilter.status}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["PENDING", "PROCESSING", "COMPLETED"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() =>
                      setVendorFilter({ ...vendorFilter, status, page: 1 })
                    }
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Date:{" "}
                  {
                    dateRangeOptions.find(
                      (opt) => opt.value === vendorFilter.dateRange
                    )?.label
                  }
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      setVendorFilter({
                        ...vendorFilter,
                        dateRange: option.value,
                        page: 1,
                      })
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search vendor..."
                value={vendorFilter.search}
                onChange={(e) => {
                  setVendorFilter({
                    ...vendorFilter,
                    search: e.target.value,
                    page: 1, // Reset page when searching
                  });
                }}
                className="w-64"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVendorFilter({ ...vendorFilter, search: "" })}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Vendor Payouts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {/* Removed checkbox column */}
                <th className="text-left p-3">Vendor</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Bank Details</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>{renderVendorRows()}</tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {vendorPayouts.length} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={vendorFilter.page === 1}
              onClick={() =>
                setVendorFilter((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={vendorFilter.page === vendorTotalPages}
              onClick={() =>
                setVendorFilter((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPayouts;
