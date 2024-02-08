import express from "express"
import nodemailer from "nodemailer"
import User from "../models/UserModal.js";
import jsonwebtoken from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import CPToken from "../models/CPTokenModal.js";
import getLastRecord from "../utils/getLastRecord.js";

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

    const lastUser = await getLastRecord(User);

    const user = await User.create({
        id: lastUser ? lastUser.id + 1 : 1,
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

});

userRoutes.post("/forgetPassword", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    const tokenObj = await CPToken.findOne({ email });

    if (!user) {
        res.status(401).json({
            message: "email not registered"
        })
        return;
    }

    const token = generateToken();

    const changePasswordLink = `https://feedy-eta.vercel.app/SignIn/resetPassword/${token}`;

    const mailOptions = {
        from: process.env.MAIL_SENDER,
        to: email,
        subject: 'Change Password',
        text: changePasswordLink
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_SENDER,
            pass: process.env.MAIL_PASS
        }
    });

    // transporter.sendMail(mailOptions, async (error, info) => {
    //     if (error) {
    //         res.status(401).json({
    //             message: "Unable to send OTP",
    //             error: error.message
    //         })
    //     } else {
    tokenObj ?
        (
            console.log(tokenObj)
        ) : await CPToken.create({
            userId: user.id,
            token: token,
            email,
            expiration_time: Date.now() + 120000
        })
    res.status(200).json({
        message: `Change Password Link sent to ${email}`,
        token: token
    });
    // }
    // });

})


userRoutes.post("/resetPassword", async (req, res) => {
    const { token, password, userId } = req.body;
})

export default userRoutes;