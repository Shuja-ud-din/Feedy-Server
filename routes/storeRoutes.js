import express from "express";
import { authentication } from "../middlewares/authentication";

const storeRoutes = express.Router();

storeRoutes.get('/', authentication, async (req, res) => {

})

export default storeRoutes;