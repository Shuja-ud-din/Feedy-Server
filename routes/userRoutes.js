import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/UserModal.js";

const userRoutes = express.Router();

userRoutes.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    // const user = await User.create({
    //     name,
    //     email,
    //     password,
    // })

    // if (user) {
    res.status(201).json({
        message: "User added successfully",
    })
    // }
    // else {
    //     res.status(400).json({
    //         message: "User not added",
    //     })
    // }
})


userRoutes.get("/", (req, res) => {
    res.json({
        message: "Get User"
    })
})

export default userRoutes;