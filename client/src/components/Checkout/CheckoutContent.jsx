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
  Plus,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronLeft,
  Lock,
  Tag,
  X,
} from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfileApi,
  getUserAddressesApi,
  addUserAddressApi,
} from "../../api/userDataApi";
import { getBuyerCouponsApi } from "../../api/couponApi";
import {
  createOrderApi,
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from "../../api/orderApi";
import OrderSuccess from "./OrderSuccess";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { loadScript } from "../../utils/loadScript";
import { razorPayKey } from "../../configuration";
import OrderFailed from "./OrderFailed";
import {
  getWalletBalanceApi,
  processWalletPaymentApi,
} from "../../api/walletApi";
import { Wallet } from "lucide-react";

const CheckoutContent = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user.user);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [walletBalance, setWalletBalance] = useState(0);

  // getwakket balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await getWalletBalanceApi();
        if (response.data.success) {
          setWalletBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch wallet balance",
          variant: "destructive",
        });
      }
    };

    fetchWalletBalance();
  }, []);

  // fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfileApi(user._id);
        setUserProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        });
      }
    };

    if (user?._id) {
      fetchUserProfile();
    }
  }, [user?._id]);

  // fetch addresses
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
        console.error("Error fetching addresses:", error);
        toast({
          title: "Error",
          description: "Failed to fetch addresses",
          variant: "destructive",
        });
      }
    };

    fetchAddresses();
  }, []);

  // fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getBuyerCouponsApi();
        if (response.data.success) {
          setAvailableCoupons(response.data.coupons);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available coupons",
          variant: "destructive",
        });
      }
    };

    fetchCoupons();
  }, []);

  const initializeRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      console.error("Error loading Razorpay SDK");
      toast({
        title: "Error",
        description: "Razorpay SDK failed to load",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleApplyCoupon = (event, coupon) => {
    event.stopPropagation();

    // Check if cart subtotal meets minimum purchase requirement
    if (cart.summary.subtotalBeforeDiscount < coupon.minPurchase) {
      toast({
        title: "Invalid Coupon",
        description: `Minimum purchase amount of ₹${formatPrice(
          coupon.minPurchase
        )} required to use this coupon`,
        variant: "destructive",
      });
      return;
    }

    setSelectedCoupon(coupon);
    setIsApplyingCoupon(false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await addUserAddressApi(addressForm);
      if (response.data) {
        // Refresh addresses list first
        const addressesResponse = await getUserAddressesApi();
        if (addressesResponse.data.addresses) {
          setAddresses(addressesResponse.data.addresses);
          // Select the newly added address
          const newAddress =
            addressesResponse.data.addresses[
              addressesResponse.data.addresses.length - 1
            ];
          setSelectedAddressId(newAddress._id);
        }

        // Reset form and close dialog
        setAddressForm({
          street: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        });
        setIsAddingNew(false);

        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

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
      if (paymentMethod === "card") {
        const initialized = await initializeRazorpay();
        if (!initialized) return;

        let amount =
          cart.summary.cartTotal -
          (selectedCoupon
            ? Math.min(
                selectedCoupon.discountType === "percentage"
                  ? (cart.summary.subtotalBeforeDiscount *
                      selectedCoupon.discountValue) /
                      100
                  : selectedCoupon.discountValue,
                selectedCoupon.maxDiscount
              )
            : 0);

        // Create Razorpay order
        const orderResponse = await createRazorpayOrderApi({
          amount: amount,
        });

        const options = {
          key: razorPayKey,
          amount: orderResponse.data.order.amount,
          currency: "INR",
          name: "Local Shop",
          description: "Payment for your order",
          order_id: orderResponse.data.order.id,
          prefill: {
            name: userProfile?.username,
            email: userProfile?.email,
            contact: userProfile?.phone,
          },
          modal: {
            ondismiss: function () {
              // Create order with failed payment status when modal is dismissed
              const orderData = {
                cart,
                selectedAddressId,
                paymentMethod: "ONLINE",
                userProfile,
                couponId: selectedCoupon?._id,
                razorpay_order_id: orderResponse.data.order.id,
                paymentStatus: "FAILED",
              };

              createOrderApi(orderData)
                .then((response) => {
                  setOrderId(response.data.order.orderId);
                  setOrderSuccess("failed");
                })
                .catch((error) => {
                  console.error("Error creating order:", error);
                  toast({
                    title: "Error",
                    description: "Failed to create order",
                    variant: "destructive",
                  });
                });
            },
          },
          handler: async (response) => {
            try {
              const orderData = {
                cart,
                selectedAddressId,
                paymentMethod: "ONLINE",
                userProfile,
                couponId: selectedCoupon?._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              try {
                // Verify payment
                await verifyRazorpayPaymentApi({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });

                // Payment successful
                orderData.paymentStatus = "COMPLETED";
                const orderResponse = await createOrderApi(orderData);
                setOrderId(orderResponse.data.order.orderId);
                setOrderSuccess("success");
              } catch (error) {
                // Payment verification failed
                orderData.paymentStatus = "FAILED";
                const orderResponse = await createOrderApi(orderData);
                setOrderId(orderResponse.data.order.orderId);
                setOrderSuccess("failed");
              }
            } catch (error) {
              console.error("Error creating order:", error);
              toast({
                title: "Error",
                description: "Failed to create order",
                variant: "destructive",
              });
            }
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else if (paymentMethod === "wallet") {
        // Calculate final amount
        let amount =
          cart.summary.cartTotal -
          (selectedCoupon
            ? Math.min(
                selectedCoupon.discountType === "percentage"
                  ? (cart.summary.subtotalBeforeDiscount *
                      selectedCoupon.discountValue) /
                      100
                  : selectedCoupon.discountValue,
                selectedCoupon.maxDiscount
              )
            : 0);

        // Check if wallet has sufficient balance
        if (walletBalance < amount) {
          toast({
            title: "Error",
            description: "Insufficient wallet balance",
            variant: "destructive",
          });
          return;
        }

        const walletPaymentResponse = await processWalletPaymentApi({
          cart,
          amount,
          selectedAddressId,
          couponId: selectedCoupon?._id,
        });

        if (walletPaymentResponse.data.success) {
          // Create order with completed payment status
          const orderData = {
            cart,
            selectedAddressId,
            paymentMethod: "WALLET",
            userProfile,
            couponId: selectedCoupon?._id,
            paymentStatus: "COMPLETED",
            transactionId: walletPaymentResponse.data.transactionId,
          };

          const response = await createOrderApi(orderData);
          setOrderId(response.data.order.orderId);
          setOrderSuccess("success");

          // Update wallet balance
          setWalletBalance(walletPaymentResponse.data.remainingBalance);
        } else {
          toast({
            title: "Error",
            description: "Wallet payment failed",
            variant: "destructive",
          });
        }

        const orderData = {
          cart,
          selectedAddressId,
          paymentMethod: "WALLET",
          userProfile,
          couponId: selectedCoupon?._id,
          paymentStatus: "PENDING",
        };
      } else {
        //for cod
        const orderData = {
          cart,
          selectedAddressId,
          paymentMethod,
          userProfile,
          couponId: selectedCoupon?._id, // Add this line
        };

        const response = await createOrderApi(orderData);

        toast({
          title: "Order placed successfully!",
          description: response.data.message,
        });

        setOrderId(response.data.order.orderId);
        setOrderSuccess("success");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order please try again later",
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                  </div>
                  <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add New Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleAddressSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={addressForm.street}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                street: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  city: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  state: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input
                            id="pincode"
                            value={addressForm.pincode}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                pincode: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                isDefault: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="isDefault">
                            Set as default address
                          </Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddingNew(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Address</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
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
                    <RadioGroupItem
                      value="COD"
                      id="cash"
                      disabled={cart.summary.cartTotal > 10000}
                    />
                    <Label
                      htmlFor="cash"
                      className={`flex items-center gap-2 ${
                        cart.summary.cartTotal > 10000
                          ? "text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      Cash On Delivery
                      {cart.summary.cartTotal > 10000 && (
                        <span className="text-xs text-red-500 ml-2">
                          (Not available for orders above ₹10,000)
                        </span>
                      )}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pay Online
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="wallet"
                      id="wallet"
                      disabled={walletBalance < cart.summary.cartTotal}
                    />
                    <Label
                      htmlFor="wallet"
                      className={`flex items-center gap-2 ${
                        walletBalance < cart.summary.cartTotal
                          ? "text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Wallet className="h-4 w-4" />
                      Pay with Wallet
                      <span className="text-sm text-gray-500 ml-2">
                        (Balance: ₹{formatPrice(walletBalance)})
                      </span>
                      {walletBalance < cart.summary.cartTotal && (
                        <span className="text-xs text-red-500 ml-2">
                          (Insufficient balance)
                        </span>
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* select coupons */}
            <Card className="mb-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Apply Coupon</h2>
                  </div>
                  {selectedCoupon ? (
                    <button
                      onClick={() => setSelectedCoupon(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsApplyingCoupon(true);
                      }}
                    >
                      Select Coupon
                    </Button>
                  )}
                </div>

                {selectedCoupon ? (
                  <div className="mt-4 space-y-3 bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {selectedCoupon.code}
                      </span>
                      <span className="font-medium text-primary">
                        {selectedCoupon.discountType === "percentage"
                          ? `${selectedCoupon.discountValue}% OFF`
                          : `₹${selectedCoupon.discountValue} OFF`}
                      </span>
                    </div>
                    <div className="text-sm space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>Minimum Purchase:</span>
                        <span>₹{selectedCoupon.minPurchase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Discount:</span>
                        <span>₹{selectedCoupon.maxDiscount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span>
                          {new Date(
                            selectedCoupon.validUntil
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">
                    Select a coupon to get discount on your order
                  </p>
                )}

                <Dialog
                  open={isApplyingCoupon}
                  onOpenChange={setIsApplyingCoupon}
                >
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Available Coupons</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {availableCoupons.map((coupon) => (
                        <div
                          key={coupon._id}
                          className={`border rounded-lg p-4 space-y-2 ${
                            cart.summary.subtotalBeforeDiscount >=
                            coupon.minPurchase
                              ? "hover:border-primary cursor-pointer"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          onClick={(e) => handleApplyCoupon(e, coupon)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-lg">
                              {coupon.code}
                            </div>
                            <div className="text-sm font-medium text-primary">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}% OFF`
                                : `₹${coupon.discountValue} OFF`}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Min. Purchase: ₹{coupon.minPurchase}
                            {cart.summary.subtotalBeforeDiscount <
                              coupon.minPurchase && (
                              <span className="text-red-500 ml-2">
                                (Add ₹
                                {formatPrice(
                                  coupon.minPurchase -
                                    cart.summary.subtotalBeforeDiscount
                                )}{" "}
                                more to use)
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Max Discount: ₹{coupon.maxDiscount}
                          </div>
                          <div className="text-xs text-gray-400">
                            Valid until{" "}
                            {new Date(coupon.validUntil).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {availableCoupons.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No coupons available
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

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

                  {selectedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount ({selectedCoupon.code})</span>
                      <span>
                        -₹
                        {formatPrice(
                          Math.min(
                            selectedCoupon.discountType === "percentage"
                              ? (cart.summary.subtotalBeforeDiscount *
                                  selectedCoupon.discountValue) /
                                  100
                              : selectedCoupon.discountValue,
                            selectedCoupon.maxDiscount
                          )
                        )}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ₹
                      {formatPrice(
                        cart.summary.cartTotal -
                          (selectedCoupon
                            ? Math.min(
                                selectedCoupon.discountType === "percentage"
                                  ? (cart.summary.subtotalBeforeDiscount *
                                      selectedCoupon.discountValue) /
                                      100
                                  : selectedCoupon.discountValue,
                                selectedCoupon.maxDiscount
                              )
                            : 0)
                      )}
                    </span>
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
                    <div
                      key={item.productId}
                      className="flex items-center space-x-4"
                    >
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
                        <div className="font-medium">
                          ₹{formatPrice(item.productTotal)}
                        </div>
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

      {orderSuccess === "success" && <OrderSuccess orderId={orderId} />}
      {orderSuccess === "failed" && <OrderFailed orderId={orderId} />}
    </div>
  );
};

export default CheckoutContent;
