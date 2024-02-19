import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    name: String,
    noOfProducts: Number
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;