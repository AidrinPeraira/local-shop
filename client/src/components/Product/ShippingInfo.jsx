
import { Truck, Clock, Shield } from "lucide-react";

const ShippingInfo = () => {
  return (
    <div className="space-y-6 p-6 bg-secondary rounded-lg">
      <h2 className="text-xl font-display font-bold text-primary">
        Shipping Information
      </h2>
      
      <div className="space-y-4">
        {/* Standard Shipping */}
        <div className="flex items-start gap-4">
          <Truck className="h-5 w-5 text-accent mt-1" />
          <div>
            <h3 className="font-medium text-primary">Standard Shipping</h3>
            <p className="text-sm text-gray-600">
              Free shipping on orders over $50
              <br />
              Estimated delivery: 5-7 business days
            </p>
          </div>
        </div>

        {/* Express Shipping */}
        <div className="flex items-start gap-4">
          <Clock className="h-5 w-5 text-accent mt-1" />
          <div>
            <h3 className="font-medium text-primary">Express Shipping</h3>
            <p className="text-sm text-gray-600">
              $15.99 shipping fee
              <br />
              Estimated delivery: 2-3 business days
            </p>
          </div>
        </div>

        {/* Guarantee */}
        <div className="flex items-start gap-4">
          <Shield className="h-5 w-5 text-accent mt-1" />
          <div>
            <h3 className="font-medium text-primary">Delivery Guarantee</h3>
            <p className="text-sm text-gray-600">
              We guarantee on-time delivery or your shipping fee is refunded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
