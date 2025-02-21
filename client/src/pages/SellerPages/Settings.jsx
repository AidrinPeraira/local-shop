
import { Card } from "../../components/ui/card";

export function SellerSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Store Settings</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Store Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input
              type="text"
              defaultValue="Gaming Gear Shop"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              defaultValue="Your one-stop shop for premium gaming accessories"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              defaultValue="contact@gaminggear.com"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Methods</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                Credit Card
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                PayPal
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Cryptocurrency
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bank Account</label>
            <input
              type="text"
              defaultValue="**** **** **** 1234"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
