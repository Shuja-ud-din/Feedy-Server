import mongoose from "mongoose";



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        console.log("Unable to connect DB");
    }
}

export default connectDB;