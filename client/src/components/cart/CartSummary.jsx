import { Button } from "../ui/button";
import { Shield, CreditCard, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";

const CartSummary = ({ itemCount, subtotal, shipping, discount }) => {
  const total = subtotal + shipping - (discount || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h2 className="text-xl font-display font-bold text-primary">
        Cart Summary ({itemCount} variations)
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <div className="text-right">
            {discount && (
              <span className="block text-gray-400 line-through">
                ${(subtotal + discount).toFixed(2)}
              </span>
            )}
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        {discount && (
          <div className="flex justify-between text-sm text-red-500">
            <span>Amount Saved</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button className="w-full bg-[#F97316] hover:bg-[#F97316]/90 h-12 text-lg font-medium">
        Check Out
      </Button>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="h-4 w-4" />
          <span>Secure payment with major cards</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeftRight className="h-4 w-4" />
          <span>30-day easy returns</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>100% secure checkout</span>
        </div>
      </div>

      <Link to="/">
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default CartSummary;
