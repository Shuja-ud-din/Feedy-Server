import express from "express"
import { adminAuthentication, authentication } from "../middlewares/authentication.js";
import Order from "../models/OrderModel.js";
import getLastRecord from "../utils/getLastRecord.js";
import User from "../models/UserModal.js";
import Product from "../models/ProductModel.js";

const ordersRoutes = express.Router();

ordersRoutes.get("/lastOrders", adminAuthentication, async (req, res) => {
    res.send("Orders")
})

ordersRoutes.post("/createOrder", async (req, res) => {
    const { userId, products, orderLocation, shippingDetails, paymentDetails } = req.body;

    const user = await User.findOne({ id: userId });

    if (!user) {
        res.json({
            success: false,
            error: "User not Found"
        });

        return;
    };

    let lastOrder = await getLastRecord(Order);
    let totalPrice = 0;

    let orderedProducts = await Product.find({ id: { $in: products.productId } });
    orderedProducts.forEach(product => {
        totalPrice = totalPrice + (product.price - product.discount);
    });
    orderedProducts = orderedProducts.map((product, index) => {
        return {
            productId: product.productId,
            quantity: products[index].quantity,
        }
    });

    try {
        const orderDetails = await Order.create({
            id: lastOrder ? lastOrder.id : 1,
            userId,
            userId,
            orderLocation,
            products: orderedProducts,
            shippingDetails: {
                location: shippingDetails.location,
                email: shippingDetails.email,
                phoneNumber: shippingDetails.phoneNumber,
            },
            paymentMethod: paymentDetails.paymentMethod,
            taxPrice: paymentDetails.taxPrice,
            shippingPrice: paymentDetails.shippingPrice,
            totalPrice,
        });

        res.status(200).json({
            success: true,
            message: "Order was successfully placed",
            data: {
                id: orderDetails.id,
                orderLocation: orderDetails.orderLocation,
                shippingDetails: {
                    location: orderDetails.shippingDetails.location,
                    email: orderDetails.shippingDetails.email,
                    phoneNumber: orderDetails.shippingDetails.phoneNumber,
                },
                paymentMethod: orderDetails.paymentMethod,
                taxPrice: orderDetails.taxPrice,
                shippingPrice: orderDetails.shippingPrice,
                totalPrice: orderDetails.totalPrice,
            }
        })
    }
    catch (error) {
        res.json({
            success: false,
            error: error.message,
        })
    }
})

export default ordersRoutes;