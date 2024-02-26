import express from "express";
import Product from "../models/ProductModel.js";
import getLastRecord from "../utils/getLastRecord.js";
import { authentication } from "../middlewares/authentication.js";

const productRoutes = express.Router();

productRoutes.post("/product", authentication, async (req, res) => {
    const { name, image, description, price, discount } = req.body;

    const lastProduct = await getLastRecord(Product);

    try {
        await Product.create({
            id: lastProduct ? lastProduct.id + 1 : 1,
            name,
            image,
            description,
            price,
            discount: discount || 0
        })

        res.status(200).json({
            success: true,
            message: "Product created successfully"
        })
    }
    catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }
})

export default productRoutes;