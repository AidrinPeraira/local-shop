
import { Card } from "../../../components/ui/card";

const products = [
  { id: 1, name: "Premium Headphones", price: "$199.99", stock: 45, category: "Electronics" },
  { id: 2, name: "Organic Coffee Beans", price: "$24.99", stock: 120, category: "Food & Beverage" },
  { id: 3, name: "Yoga Mat", price: "$29.99", stock: 80, category: "Sports" },
  { id: 4, name: "Smart Watch", price: "$299.99", stock: 30, category: "Electronics" },
  { id: 5, name: "Running Shoes", price: "$89.99", stock: 65, category: "Sports" },
];

export function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-admin-accent text-white px-4 py-2 rounded-lg">Add Product</button>
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
                <th className="text-left p-3">Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{product.id}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
