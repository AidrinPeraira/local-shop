import { Card } from "../../components/ui/card";
import { DollarSign, Package, ShoppingBag, Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function SellerHome() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-3xl bg whitespace-normal text-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl text-black font-bold mb-2">Welcome to Seller Dashboard</h1>
        <p className="text-lg text-black">
          Manage your products, track sales, and grow your business.
        </p>
      </Card>
    </div>
  );
}
