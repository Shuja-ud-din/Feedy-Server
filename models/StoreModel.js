import mongoose from "mongoose";

const StoreSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
});

const StoreModel = mongoose.model("Store", StoreSchema);

export default StoreModel;