import nodemailer from "nodemailer"
import express from "express"
import User from "../models/UserModal.js";
import CPToken from "../models/CPTokenModal.js";

const otp = express.Router();


otp.get("/generateOTP", async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(201).json({
            message: "Email not registered"
        });
        return;
    };

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const mailOptions = {
        from: process.env.MAIL_SENDER,
        to: email,
        subject: 'OTP',
        text: otp
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_SENDER,
            pass: process.env.MAIL_PASS
        }
    });

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            res.json({
                message: "Unable to send OTP",
                error: error.message
            })
        } else {
            user.otp = otp;
            user.isVerifed = false;
            await user.save();
            res.status(200).json({
                message: `OTP sent to ${email}`
            });
        }
    });
})

otp.post("/verifyOTP", async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(201).json({
            message: "Email not Registered"
        })
    }

    if (user && otp === user.otp) {
        user.isVerifed = true;
        await user.save();
        res.status(200).json({
            message: "OTP verified"
        })
    }
    else {
        res.status(201).json({
            message: "Invalid OTP"
        })
    }
})

otp.post('/verifyToken', async (req, res) => {
    const { token, userId } = req.body;

    const tokenObj = await CPToken.find({ userId: userId });

    if (!tokenObj[0]) {
        res.status(201).json({
            message: "Invalid userId"
        })
        return;
    }

    if (userId === tokenObj[0].userId && token === tokenObj[0].token && Date.now().toString() < tokenObj[0].expiration_time) {
        res.status(200).json({
            message: "Authentication Successful"
        })
    }
    else {
        res.status(201).json({
            message: "Token expired"
        })
    }

})

export default otp;