import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/UserModal.js";
import jsonwebtoken from "jsonwebtoken";

const userRoutes = express.Router();

userRoutes.post("/singup", async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400).json({
            message: "Email already Taken"
        })
        return
    }

    const user = await User.create({
        name,
        email,
        password,
        isVerifed: false,
        role: "User",
        otp: null
    })

    if (user) {
        res.status(201).json({
            message: "User added successfully",
        })
    }
    else {
        res.status(400).json({
            message: "User not added",
        })
    }
})

userRoutes.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(202).json({
            message: "User not found"
        })
        return;
    }

    if (password === user.password) {
        const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token
        })
    }
    else {
        res.json({
            message: "Incorrect Password"
        })
    }

})


userRoutes.get("/", async (req, res) => {
    const user = await User.find({})
    res.json({
        message: "Get User",
        data: user
    })
})

userRoutes.get("/tes", (re1, res) => {
    res.json({
        message: "Test"
    })
})

export default userRoutes;