
import { Card } from "../../components/ui/card";

const orders = [
  { id: "#ORD001", product: "Gaming Mouse", customer: "John Doe", date: "2024-02-20", status: "Shipped" },
  { id: "#ORD002", product: "Mechanical Keyboard", customer: "Jane Smith", date: "2024-02-19", status: "Processing" },
  { id: "#ORD003", product: "Gaming Headset", customer: "Mike Johnson", date: "2024-02-18", status: "Delivered" },
  { id: "#ORD004", product: "Mousepad XL", customer: "Sarah Williams", date: "2024-02-17", status: "Processing" },
  { id: "#ORD005", product: "Gaming Chair", customer: "Tom Brown", date: "2024-02-16", status: "Cancelled" },
];

export default function SellerOrders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
