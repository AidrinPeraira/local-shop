
import { Card } from "../../components/ui/card";

const products = [
  { id: 1, name: "Gaming Mouse", price: "$59.99", stock: 25, sales: 150 },
  { id: 2, name: "Mechanical Keyboard", price: "$129.99", stock: 15, sales: 80 },
  { id: 3, name: "Gaming Headset", price: "$89.99", stock: 30, sales: 200 },
  { id: 4, name: "Mousepad XL", price: "$19.99", stock: 50, sales: 300 },
  { id: 5, name: "Gaming Chair", price: "$299.99", stock: 10, sales: 45 },
];

export default function SellerProducts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button className="bg-admin-accent text-white px-4 py-2 rounded-lg">Add New Product</button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{product.id}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
