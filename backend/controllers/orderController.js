
import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const buildIdQuery = (id) => {
  if (!id) return { _id: null };
  return mongoose.Types.ObjectId.isValid(id) && typeof id === 'string' && id.length === 24
    ? { $or: [{ _id: id }, { _id: new mongoose.Types.ObjectId(id) }] }
    : { _id: id };
};

// Place an order using Cash on Delivery
const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.body.userId || req.userId;

    if (!userId || !items?.length || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required order details",
      });
    }

    const deliveryFee = 10;
    let authoritativeSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productId = item._id || item.id;
      const dbProduct = await productModel.findOne(buildIdQuery(productId));
      const unitPrice = dbProduct && Number.isFinite(Number(dbProduct.price))
        ? Number(dbProduct.price)
        : Number(item.price || 0);

      const quantity = Math.max(1, Number(item.quantity) || 1);
      authoritativeSubtotal += unitPrice * quantity;

      verifiedItems.push({
        ...item,
        price: unitPrice,
        quantity,
      });
    }

    const authoritativeTotal = authoritativeSubtotal + deliveryFee;

    const orderData = {
      userId,
      items: verifiedItems,
      address,
      amount: authoritativeTotal,
      paymentMethod: "Cash On Delivery",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
      amount: authoritativeTotal,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders for the admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("All orders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get orders belonging to the logged-in user
const userOrders = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("User orders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get tracking details for one order
const trackOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      tracking: {
        orderId: order._id,
        status: order.status || "Order Placed",
        date: order.date,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        amount: order.amount,
        address: order.address,
        items: order.items,
      },
    });
  } catch (error) {
    console.error("Track order error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!orderId || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID or order status",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  trackOrder,
  updateStatus,
};
