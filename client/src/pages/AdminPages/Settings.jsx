
import { Card } from "../../components/ui/card";

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <input
              type="text"
              defaultValue="Admin Dashboard"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              defaultValue="admin@example.com"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select className="w-full p-2 border rounded-lg dark:bg-gray-800">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SMTP Host</label>
            <input
              type="text"
              defaultValue="smtp.example.com"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SMTP Port</label>
            <input
              type="text"
              defaultValue="587"
              className="w-full p-2 border rounded-lg dark:bg-gray-800"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
