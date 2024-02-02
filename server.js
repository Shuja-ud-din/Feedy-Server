import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectDB from "./config/ConnectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

connectDB().catch(console.dir);

app.use("/api/", userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})