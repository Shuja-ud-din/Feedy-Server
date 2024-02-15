import express from "express"
import { adminAuthentication, authentication } from "../middlewares/authentication.js";

const ordersRoutes = express.Router();

ordersRoutes.get("/lastOrders", adminAuthentication, async (req, res) => {
    res.send("Orders")
})


export default ordersRoutes;