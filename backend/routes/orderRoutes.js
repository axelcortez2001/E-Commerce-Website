import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModels.js";
import User from "../models/userModel.js";
const orderRouter = express.Router();
import Product from "../models/productModel.js";

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const neworder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      customerDetails: req.body.customerDetails,
      totalPrice: req.body.totalPrice,
      expiryDate: req.body.expiryDate,
      user: req.user._id,
    });

    const order = await neworder.save();
    res.status(201).send({ message: "New order created!", order });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user });
    if (orders) {
      res.send(orders);
      console.log(orders);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/done",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.isFailed = false;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: "Order Done" });
    } else {
      res.status(404).send({ message: "Order not found!" });
    }
  })
);
orderRouter.put(
  "/:id/fail",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "email");
    if (order) {
      order.isFailed = true;
      order.isDelivered = false;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();

      // Update the product countInStock
      const orderItems = updatedOrder.orderItems;
      for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i];
        const product = await Product.findById(item.product);
        if (product) {
          const countInStock = parseInt(product.countInStock) + item.quantity;
          product.countInStock = countInStock.toString();
          await product.save();
        }
      }

      res.status(200).send(updatedOrder);
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

export default orderRouter;
