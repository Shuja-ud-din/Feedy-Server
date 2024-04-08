import express from "express";
import {
  adminAuthentication,
  authentication,
} from "../middlewares/authentication.js";
import Order from "../models/OrderModel.js";
import getLastRecord from "../utils/getLastRecord.js";
import User from "../models/UserModal.js";
import Product from "../models/ProductModel.js";

const ordersRoutes = express.Router();

ordersRoutes.get("/lastOrders", authentication, async (req, res) => {
  try {
    let orders = await Order.find({}).sort({ _id: -1 }).limit(5);

    if (!orders || orders.length === 0) {
      throw new Error("No orders found");
    }

    orders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findOne({ id: order.userId });

        return {
          id: order.id,
          userId: order.userId,
          userName: user.name,
          status: order.status,
          paymentMethod: order.paymentMethod,
          createdAt: order.dateOfOrder,
          totalPrice: order.totalPrice,
        };
      })
    );

    res.json({
      success: true,
      message: "Newest 5 Orders",
      data: orders.reverse(),
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
});

ordersRoutes.get("/allOrders", authentication, async (req, res) => {
  try {
    let orders = await Order.find({});

    if (!orders || orders.length === 0) {
      res.json({
        success: true,
        message: "No orders found",
        data: [],
      });

      return;
    }

    orders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findOne({ id: order.userId });

        return {
          id: order.id,
          userId: order.userId,
          userName: user.name,
          phoneNumber: order.shippingDetails.phoneNumber,
          adress: order.shippingDetails.address,
          status: order.status,
          dateOfDelivery: order.dateOfDelivery,
          paymentMethod: order.paymentMethod,
          createdAt: order.dateOfOrder,
          totalPrice: order.totalPrice,
        };
      })
    );

    res.json({
      success: true,
      message: "All orders",
      data: orders,
    });
  } catch {}
});

ordersRoutes.post("/createOrder", authentication, async (req, res) => {
  const {
    userId,
    products,
    orderLocation,
    shippingDetails,
    paymentDetails = {
      shippingPrice: 0,
      taxPrice: 0,
    },
  } = req.body;

  const user = await User.findOne({ id: userId });

  if (!user) {
    res.json({
      success: false,
      error: "User not Found",
    });

    return;
  }

  let lastOrder = await getLastRecord(Order);
  let totalPrice = 0,
    discount = 0;

  let orderedProducts = await Product.find({
    id: { $in: products.map((item) => item.productId) },
  });

  if (orderedProducts.length !== products.length) {
    res.json({
      success: false,
      error: "Product not found",
    });

    return;
  }

  orderedProducts.forEach((product, index) => {
    totalPrice = totalPrice + product.price * products[index].quantity;
    discount = discount + product.discount * products[index].quantity;
  });
  orderedProducts = orderedProducts.map((product, index) => {
    return {
      productId: product.id,
      quantity: products[index].quantity,
      price: product.price,
      discount: product.discount,
    };
  });

  try {
    const orderDetails = await Order.create({
      id: lastOrder ? lastOrder.id + 1 : 1,
      userId,
      userId,
      orderLocation,
      products: orderedProducts,
      shippingDetails: {
        location: shippingDetails.location,
        email: shippingDetails.email,
        phoneNumber: shippingDetails.phoneNumber,
      },
      paymentMethod: paymentDetails?.paymentMethod,
      taxPrice: paymentDetails?.taxPrice,
      shippingPrice: paymentDetails?.shippingPrice,
      discount,
      totalPrice:
        totalPrice -
        discount +
        paymentDetails.taxPrice +
        paymentDetails.shippingPrice,
    });

    res.status(200).json({
      success: true,
      message: "Order was successfully placed",
      data: {
        orderId: orderDetails.id,
        orderLocation: orderDetails.orderLocation,
        shippingDetails: {
          location: orderDetails.shippingDetails.location,
          email: orderDetails.shippingDetails.email,
          phoneNumber: orderDetails.shippingDetails.phoneNumber,
        },
        paymentMethod: orderDetails.paymentMethod,
        discount,
        taxPrice: orderDetails.taxPrice,
        shippingPrice: orderDetails.shippingPrice,
        totalPrice: orderDetails.totalPrice,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});

ordersRoutes.get("/orders/:id", async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ id: id });

  res.json({
    success: true,
    message: "Order",
    order,
  });
});

export default ordersRoutes;
