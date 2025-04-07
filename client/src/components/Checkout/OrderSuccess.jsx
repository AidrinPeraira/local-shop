import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const OrderSuccess = ({ orderId }) => {
  
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId;
  
    if (countdown === 0) {
      navigate("/profile/orders", { replace: true });
    } else {
      timeoutId = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
  
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [countdown, navigate, dispatch]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your order ID: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to orders page in {countdown} seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;