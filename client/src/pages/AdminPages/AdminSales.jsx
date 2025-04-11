import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
  Download,
  Calendar,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { getSalesReportApi } from "../../api/salesApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminSales() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalDiscount: 0,
    totalProductDiscount: 0,
    totalCouponDiscount: 0,
    totalPlatformFee: 0,
    totalShippingCharge: 0,
  });
  const [period, setPeriod] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: currentPage,
        limit: 10,
        sort: sortBy,
        order: sortOrder,
        search: searchQuery,
        period: period !== "custom" ? period : undefined,
        startDate: period === "custom" ? startDate : undefined,
        endDate: period === "custom" ? endDate : undefined,
      };

      const { data } = await getSalesReportApi(queryParams);
      if (data) {
        setOrders(data.orders);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [currentPage, period, startDate, endDate, sortBy, sortOrder, searchQuery]);

  const generateSalesReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Sales Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(
      `Period: ${period === "custom" ? `${startDate} to ${endDate}` : period}`,
      14,
      36
    );

    // Add summary statistics
    doc.setFontSize(12);
    doc.text("Summary", 14, 45);
    const summaryData = [
      ["Total Orders", stats.totalOrders],
      ["Total Amount", `Rs. ${stats.totalAmount.toLocaleString()}`],
      ["Total Discount", `Rs. ${stats.totalDiscount.toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
    });

    // Add orders table
    const orderData = orders.map((order) => [
      order.orderId,
      new Date(order.createdAt).toLocaleDateString(),
      `Rs. ${order.summary.cartTotal}`,
      `Rs. ${order.summary.totalDiscount + order.summary.couponDiscount}`,
      order.orderStatus,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Order ID", "Date", "Amount", "Discount", "Status"]],
      body: orderData,
    });

    // Save the PDF
    doc.save(
      `sales-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <Button
          onClick={generateSalesReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <h3 className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5" />
                {stats.totalAmount?.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Discount</p>
              <h3 className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5" />
                {stats.totalDiscount?.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Platform Fee</p>
              <h3 className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5" />
                {stats.totalPlatformFee?.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>
      </div>
      {/* Discount Breakdown Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Discount Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Product Discounts</p>
            <p className="text-xl font-semibold flex items-center">
              <IndianRupee className="h-4 w-4" />
              {stats.totalProductDiscount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Coupon Discounts</p>
            <p className="text-xl font-semibold flex items-center">
              <IndianRupee className="h-4 w-4" />
              {stats.totalCouponDiscount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shipping Charges</p>
            <p className="text-xl font-semibold flex items-center">
              <IndianRupee className="h-4 w-4" />
              {stats.totalShippingCharge?.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Time Period Filter */}
          <div>
            <h2 className="font-semibold mb-2">Time Period</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setPeriod("day")}>
                  Day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("week")}>
                  Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("month")}>
                  Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("year")}>
                  Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("custom")}>
                  Custom Range
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Custom Date Range */}
          {period === "custom" && (
            <>
              <div>
                <h2 className="font-semibold mb-2">Start Date</h2>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <h2 className="font-semibold mb-2">End Date</h2>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}

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
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Seller</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Discount</th>
                <th className="text-left p-3">Platform Fee</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div>
                      <p>{order.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {order.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.seller.sellerName}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {order.summary.cartTotal.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {(
                          order.summary.totalDiscount +
                          order.summary.couponDiscount
                        ).toLocaleString()}
                      </p>
                      {order.summary.couponDiscount > 0 && (
                        <p className="text-sm text-gray-500">
                          (Coupon: Rs. {order.summary.couponDiscount})
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {order.summary.platformFee.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">{order.orderStatus}</td>
                </tr>
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
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
          }
          disabled={currentPage === pagination.totalPages || loading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
