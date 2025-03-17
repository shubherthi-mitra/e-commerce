import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  updateStatus,
  userOrders,
  verifyRazorpay,
} from "../controllers/order.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const orderRouter = express.Router();

//ADMIN FEATURE
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

//PAYMENT FEATURE
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

//USER FEATURE
orderRouter.post("/userorders", authUser, userOrders);

//VERIFY PAYMENT
orderRouter.post("/verifyrazorpay", authUser, verifyRazorpay);

export default orderRouter;
