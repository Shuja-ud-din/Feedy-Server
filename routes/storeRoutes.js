import express from "express";
import { authentication } from "../middlewares/authentication.js";
import Store from "../models/StoreModel.js";
import getLastRecord from "../utils/getLastRecord.js";

const storeRoutes = express.Router();

storeRoutes.get('/stores', authentication, async (req, res) => {

    try {
        const store = await Store.find();

        const data = store.map((order) => {
            return {
                id: order.id,
                name: order.name,
                contactNo: order.contactNo,
                adminEmail: order.adminEmail,
                adress: order.adress
            }
        })

        res.json({
            success: true,
            message: "All Orders",
            data
        })

    } catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }

})


storeRoutes.get('/store/:storeId', authentication, async (req, res) => {

    const { storeId } = req.params;

    try {
        const order = await Store.findOne({ id: storeId });

        const data = {
            id: order.id,
            name: order.name,
            contactNo: order.contactNo,
            adminEmail: order.adminEmail,
            adress: order.adress,
            zipCode: order.zipCode,
            location: order.location,
            storeTiming: order.storeTiming,
            pickupTiming: order.pickupTiming,
            deliveryTiming: order.deliveryTiming
        }

        res.json({
            success: true,
            message: "Order",
            order: data
        })

    } catch (error) {
        res.json({
            success: false,
            error: "Order not Found"
        })
    }

})


storeRoutes.post("/store/createStore", authentication, async (req, res) => {
    const { name, contactNo, adminEmail, adress, zipCode, location, storeTiming, pickupTiming, deliveryTiming } = req.body;

    const isEmailValid = await Store.findOne({ adminEmail });

    if (isEmailValid) {
        res.json({
            success: false,
            message: "Store already Registered with this email"
        })
        return;
    }

    const isContactValid = await Store.findOne({ contactNo });
    if (isContactValid) {
        res.json({
            success: false,
            message: "Store already Registered with this Contact"
        })
        return;
    }

    const lastOrder = await getLastRecord(Store);

    try {
        const store = await Store.create({
            id: lastOrder ? lastOrder.id + 1 : 1,
            name,
            contactNo,
            adminEmail,
            adress,
            zipCode,
            location,
            storeTiming,
            pickupTiming,
            deliveryTiming
        });

        res.json({
            success: true,
            message: "Store created successfully",
        })

    } catch (error) {
        res.json({
            success: false,
            error: error.message,
        })
    }
})

export default storeRoutes;