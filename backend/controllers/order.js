import orderModel from "../models/order.js";
import userModel from "../models/user.js";
import Razorpay from "razorpay";

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

//GLOBAL VARIABLES
const currency = "inr";
const deliveryCharges = 10;

//GET WAY INITIALIZE
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// PLACING ORDERS USING COD
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// PLACING ORDERS USING RAZORPAY
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
      } else {
        res.json({ success: true, order });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderinfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderinfo._id, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderinfo._id);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//ALL ORDERS DATA FOR ADMIN PANEL
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//USER ORDERS DATA FOR FRONTEND
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//UPDATE ORDER STATUS FROM ADMIN PANEL
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
