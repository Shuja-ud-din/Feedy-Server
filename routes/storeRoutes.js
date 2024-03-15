import express from "express";
import { authentication } from "../middlewares/authentication.js";
import Store from "../models/StoreModel.js";
import getLastRecord from "../utils/getLastRecord.js";

const storeRoutes = express.Router();

storeRoutes.get('/stores', authentication, async (req, res) => {

    try {
        const store = await Store.find();

        const data = store.map((store) => {
            return {
                id: store.id,
                name: store.name,
                contactNo: store.contactNo,
                adminEmail: store.adminEmail,
                adress: store.adress
            }
        })

        res.json({
            success: true,
            message: "All Stores",
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
        const store = await Store.findOne({ id: storeId });

        const data = {
            id: store.id,
            name: store.name,
            contactNo: store.contactNo,
            adminEmail: store.adminEmail,
            adress: store.adress,
            zipCode: store.zipCode,
            location: store.location,
            storeTiming: store.storeTiming,
            pickupTiming: store.pickupTiming,
            deliveryTiming: store.deliveryTiming
        }

        res.json({
            success: true,
            message: "Store",
            store: data
        })

    } catch (error) {
        res.json({
            success: false,
            error: "Store not Found"
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