
import { Card } from "../../components/ui/card";
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
  { name: "Jun", value: 900 },
];

const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
  },
  {
    name: "Orders",
    value: "2,345",
    change: "+15.1%",
    icon: ShoppingCart,
  },
  {
    name: "Users",
    value: "12,234",
    change: "+2.3%",
    icon: Users,
  },
  {
    name: "Active Sessions",
    value: "573",
    change: "+10.5%",
    icon: BarChart3,
  },
];

export default function AdminDashboard() {
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
                dataKey="value"
                stroke="#228be6"
                fill="#228be6"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
