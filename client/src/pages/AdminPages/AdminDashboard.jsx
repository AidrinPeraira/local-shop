
import { Card } from "../../components/ui/card";
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";




export default function AdminDashboard() {
  return (
    <Card className="w-full max-w-3xl bg whitespace-normal text-white shadow-lg rounded-2xl p-8 text-center">
    <h1 className="text-3xl text-black font-bold mb-2">Welcome to Admin Dashboard</h1>
    <p className="text-lg text-black">
      Manage your sellers and users, track products, and help businessess grow.
    </p>
  </Card>
  );
}
