import express from "express";
import Product from "../models/ProductModel.js";
import getLastRecord from "../utils/getLastRecord.js";

const productRoutes = express.Router();

productRoutes.post("/product", async (req, res) => {
    const { name, image, description, price, discount } = req.body;

    // if (!name || !image || !description || !price) return res.status(400).json({
    //     success: false,
    //     message: "Missing fields"
    // });

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