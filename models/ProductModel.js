import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0.0,
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;