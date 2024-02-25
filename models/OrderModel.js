import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    userId: {
        type: Number,
        required: true
    },
    dateOfOrder: {
        type: String,
        default: new Date()
    },
    dateOfDelivery: {
        type: String,
        default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    deliveredAt: {
        type: Date,
    },
    status: {
        type: String,
        default: "Pending"
    },
    orderLocation: {
        type: String,
        default: "3D Program , Asholoo, Oboimxs 1192 22190, SW"
    },
    products: [{
        quantity: Number,
        productId: {
            type: Number,
            required: true,
            ref: "Product",
        },
        status: {
            type: String,
            default: "Default"
        }
    }],
    shippingDetails: {
        location: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        default: "Paypal",
    },
    taxPrice: {
        type: Number,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.model("Orders", OrderSchema);
export default Order;