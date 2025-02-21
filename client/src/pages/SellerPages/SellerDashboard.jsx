
import { Card } from "../../components/ui/card";
import { DollarSign, Package, ShoppingBag, Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1800 },
  { name: "Mar", sales: 6000, revenue: 3600 },
  { name: "Apr", sales: 8000, revenue: 4800 },
  { name: "May", sales: 7000, revenue: 4200 },
  { name: "Jun", sales: 9000, revenue: 5400 },
];

const stats = [
  {
    name: "Total Revenue",
    value: "$12,345.67",
    change: "+12.3%",
    icon: DollarSign,
  },
  {
    name: "Total Orders",
    value: "156",
    change: "+8.2%",
    icon: ShoppingBag,
  },
  {
    name: "Products",
    value: "48",
    change: "+4.1%",
    icon: Package,
  },
  {
    name: "Average Rating",
    value: "4.8",
    change: "+0.3",
    icon: Star,
  },
];

export const SellerDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-admin-accent/10 rounded-full">
                <stat.icon className="h-6 w-6 text-admin-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Sales Overview</h2>
            <p className="text-sm text-gray-500">Monthly sales performance</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#228be6"
                  fill="#228be6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className="text-sm text-gray-500">Monthly revenue performance</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#40c057"
                  fill="#40c057"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
