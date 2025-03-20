import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileApi, getUserAddressesApi } from "../../api/userDataApi";
import { createOrderApi } from "../../api/orderApi";
import OrderSuccess from "./OrderSuccess";
import { clearCart } from "../../redux/features/cartSlice";

const CheckoutContent = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfileApi(user._id);
        setUserProfile(response.data.user);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch user profile",
          variant: "destructive",
        });
      }
    };

    if (user?._id) {
      fetchUserProfile();
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getUserAddressesApi();
        if (response.data.addresses) {
          setAddresses(response.data.addresses);
          // Set default address as selected if exists
          const defaultAddress = response.data.addresses.find(
            (addr) => addr.isDefault
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch addresses",
          variant: "destructive",
        });
      }
    };

    fetchAddresses();
  }, []);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const orderData = {
        cart,
        selectedAddressId,
        paymentMethod,
        userProfile
      };
  
      const response = await createOrderApi(orderData);
  

        toast({
          title: "Order placed successfully!",
          description: response.data.message,
        });
        
        setOrderId(response.data.order.orderId);
        setOrderSuccess(true);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response.data.message || "Failed to place order",
          variant: "destructive",
        });
      }
    };

  const formatPrice = (price) => {
    const priceStr = price.toFixed(2);
    const [whole, decimal] = priceStr.split(".");
    const withCommas = whole.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    return `${withCommas}.${decimal}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/cart")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Billing Information</h2>
                </div>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        defaultValue={userProfile?.username.split(" ")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        defaultValue={userProfile?.username.split(" ")[1] || ""}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 absolute ml-3" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        placeholder="john.doe@example.com"
                        required
                        defaultValue={userProfile?.email}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 absolute ml-3" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        placeholder="+1 (555) 000-0000"
                        defaultValue={userProfile?.phone}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>

                {addresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddressId}
                    onValueChange={setSelectedAddressId}
                    className="grid gap-4"
                  >
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className="flex items-start space-x-3"
                      >
                        <RadioGroupItem
                          value={address._id}
                          id={address._id}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={address._id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">
                            {address.isDefault && (
                              <span className="text-primary text-sm">
                                (Default){" "}
                              </span>
                            )}
                            {address.street}
                          </div>
                          <div className="text-sm text-gray-500">
                            {address.city}, {address.state} {address.pincode}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No saved addresses found.</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => navigate("/profile/addresses")}
                    >
                      Add New Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>
                <RadioGroup
                  defaultValue="card"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="COD" id="cash" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cash On Delivery
                    </Label>
                  </div>


                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="mt-4 grid gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvc"
                            type="password"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* Order Summary Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      ₹{formatPrice(cart.summary.subtotalBeforeDiscount)}
                    </span>
                  </div>

                  {cart.summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount</span>
                      <span>-₹{formatPrice(cart.summary.totalDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{formatPrice(cart.summary.shippingCharge)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>₹{formatPrice(cart.summary.platformFee)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{formatPrice(cart.summary.cartTotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Place Order
                </Button>
              </CardFooter>
            </Card>

            {/* Add the new Order Items Summary card */}
            <Card className="mt-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <div className="text-sm text-gray-500">
                          {item.variants.map((variant) => (
                            <div key={variant.variantId}>
                              {variant.attributes} × {variant.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{formatPrice(item.productTotal)}</div>
                        {item.productDiscount > 0 && (
                          <div className="text-sm text-green-600">
                            Save ₹{formatPrice(item.productDiscount)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {orderSuccess && <OrderSuccess orderId={orderId} />}
    </div>
    
  );
};

export default CheckoutContent;
