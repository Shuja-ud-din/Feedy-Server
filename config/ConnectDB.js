import mongoose from "mongoose";

const dbLink = "mongodb+srv://shuja1339:Shuja1339BD@project.vinxobu.mongodb.net/MyDb?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(dbLink)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        console.log("Unable to connect DB");
    }
}

export default connectDB;