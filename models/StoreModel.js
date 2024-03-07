import mongoose from "mongoose";

const StoreSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
        unique: true,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true,
    },
    adress: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    storeTiming: {
        storeDays: {
            type: Array
        },
        startTime: String,
        closingTime: String
    },
    pickupTiming: {
        pickupDays: {
            type: Array
        },
        startTime: String,
        closingTime: String
    },
    deliveryTiming: {
        deliveryDays: {
            type: Array
        },
        startTime: String,
        closingTime: String
    },
    storeImage: {
        type: String,
        default: "store.png"
    }
});

const Store = mongoose.model("Store", StoreSchema);

export default Store;