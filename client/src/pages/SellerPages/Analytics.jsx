
import { Card } from "../../components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

const monthlyData = [
  { month: "Jan", sales: 65, visitors: 400 },
  { month: "Feb", sales: 45, visitors: 300 },
  { month: "Mar", sales: 90, visitors: 600 },
  { month: "Apr", sales: 120, visitors: 800 },
  { month: "May", sales: 85, visitors: 700 },
  { month: "Jun", sales: 130, visitors: 900 },
];

const productPerformance = [
  { name: "Gaming Mouse", sales: 150, revenue: 8995 },
  { name: "Mechanical Keyboard", sales: 80, revenue: 10399 },
  { name: "Gaming Headset", sales: 200, revenue: 17998 },
  { name: "Mousepad XL", sales: 300, revenue: 5997 },
  { name: "Gaming Chair", sales: 45, revenue: 13499 },
];

export default function SellerAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#228be6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Visitor Traffic</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#40c057" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Product Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Total Sales</th>
                <th className="text-left p-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.map((product) => (
                <tr key={product.name} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.sales}</td>
                  <td className="p-3">${product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
