import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
    },
    products: {
        type: Array,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    status: String,
    adress: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    price: Number,
})

const OrderModal = mongoose.model("Orders", OrderSchema);
export default OrderModal;