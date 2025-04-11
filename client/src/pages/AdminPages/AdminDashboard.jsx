import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingDown,
  Package,
  RefreshCcw,
  Percent,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardStatsApi } from "../../api/dashboardApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {
  const doc = new jsPDF();
  doc.autoTable = autoTable;
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    totalSellers: 0,
    cancellations: 0,
    returns: 0,
    totalDiscounts: 0,
    revenueData: [],
    topProducts: [],
  });

  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await getDashboardStatsApi(timeRange);
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSalesReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Sales Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Time Period: ${timeRange}`, 14, 36);

    // Add summary statistics
    doc.setFontSize(12);
    doc.text("Summary", 14, 45);
    const summaryData = [
      ["Total Orders", stats.totalOrders],
      ["Total Sales", `Rs. ${stats.totalSales.toLocaleString()}`],
      ["Total Customers", stats.totalCustomers],
      ["Returns", stats.returns],
      ["Cancellations", stats.cancellations],
      ["Total Discounts", `Rs. ${stats.totalDiscounts.toLocaleString()}`],
    ];

    // Use the imported autoTable directly
    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
    });

    // Add top products table
    doc.text("Top Products", 14, doc.lastAutoTable.finalY + 15);
    const productData = stats.topProducts.map((product, index) => [
      index + 1,
      product.name,
      product.soldCount,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["#", "Product Name", "Units Sold"]],
      body: productData,
      theme: "grid",
    });

    // Add revenue data
    doc.text("Revenue Trend", 14, doc.lastAutoTable.finalY + 15);
    const revenueData = stats.revenueData.map((item) => [
      item.date,
      `Rs. ${item.revenue.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Date", "Revenue"]],
      body: revenueData,
      theme: "grid",
    });

    // Save the PDF
    doc.save(
      `sales-report-${timeRange}-${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded p-2"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={generateSalesReport}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Metrics row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center space-x-4">
          <ShoppingCart className="h-10 w-10 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <DollarSign className="h-10 w-10 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <h3 className="text-2xl font-bold">
              ₹{stats.totalSales.toLocaleString()}
            </h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <Users className="h-10 w-10 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <Package className="h-10 w-10 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Active Sellers</p>
            <h3 className="text-2xl font-bold">{stats.totalSellers}</h3>
          </div>
        </Card>
      </div>

      {/* Metrics Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 flex items-center space-x-4">
          <TrendingDown className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Cancellations</p>
            <h3 className="text-xl font-bold">{stats.cancellations}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <RefreshCcw className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Returns</p>
            <h3 className="text-xl font-bold">{stats.returns}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <Percent className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Discounts</p>
            <h3 className="text-xl font-bold">
              ₹{stats.totalDiscounts.toLocaleString()}
            </h3>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stats.revenueData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Products and Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Top Products</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <span className="text-sm">{product.soldCount} sold</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {stats.categoryDistribution?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
