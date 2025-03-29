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
  Percent 
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
  Cell
} from "recharts";
import { getDashboardStatsApi } from "../../api/dashboardApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    totalSellers: 0,
    cancellations: 0,
    returns: 0,
    totalDiscounts: 0,
    revenueData: [],
    topProducts: []
  });

  const [timeRange, setTimeRange] = useState('week');
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded p-2"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">This Year</option>
        </select>
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
            <h3 className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</h3>
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
            <h3 className="text-xl font-bold">₹{stats.totalDiscounts.toLocaleString()}</h3>
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
              <div key={product._id} className="flex items-center justify-between">
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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