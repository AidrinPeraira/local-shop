import { asyncHandler } from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Address from "../models/userAddresssModel.js";
import Cart from "../models/cartModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cart, selectedAddressId, paymentMethod, userProfile } = req.body;

  try {
    // 1. Generate custom order ID
    const timestamp = new Date();
    const dateStr = timestamp
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const customOrderId = `ODR${dateStr}${randomStr}`;

    // 2. Get shipping address
    const shippingAddress = await Address.findById(selectedAddressId);
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    const itemsWithSeller = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // Update stock for each variant
        for (const orderVariant of item.variants) {
          const productVariant = product.variants.find(
            v => v.variantId === orderVariant.variantId
          );
          
          if (!productVariant) {
            throw new Error(`Variant not found: ${orderVariant.variantId}`);
          }

          // Check if enough stock is available
          if (productVariant.stock < orderVariant.quantity) {
            throw new Error(`Insufficient stock for ${item.productName} - ${orderVariant.attributes}`);
          }

          // Update variant stock
          productVariant.stock -= orderVariant.quantity;
          productVariant.inStock = productVariant.stock > 0;
        }

        // Save the updated product
        await product.save();

        return {
          ...item,
          seller: product.seller,
        };
      })
    );

  
    // 3. Create new order
    const order = new Order({
      orderId: customOrderId, // Add this line
      user: userId,
      items: itemsWithSeller,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        phone: shippingAddress.phone || userProfile?.phone || req.body.phone, // Add fallback options for phone
      },
      summary: {
        subtotalBeforeDiscount: cart.summary.subtotalBeforeDiscount,
        totalDiscount: cart.summary.totalDiscount,
        subtotalAfterDiscount: cart.summary.subtotalAfterDiscount,
        shippingCharge: cart.summary.shippingCharge,
        platformFee: cart.summary.platformFee,
        cartTotal: cart.summary.cartTotal,
      },
      payment: {
        method: paymentMethod === "card" ? "ONLINE" : "COD",
        status: paymentMethod === "card" ? "PENDING" : "COMPLETED",
      },
      orderStatus: "PENDING",
      trackingDetails: [{
        status: "Order Placed",
        timestamp: new Date(),
        description: "Your order has been placed successfully",
      }],
    });

    // 4. Save the order
    await order.save();

    // 5. Clear cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );

    // 6. Send response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        orderId: order._id,
        total: order.summary.cartTotal,
        status: order.orderStatus,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});
