import nodemailer from "nodemailer"
import express from "express"
import User from "../models/UserModal.js";

const otp = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASS
    }
});

otp.get("/generateOTP", async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400).json({
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

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            res.json({
                message: "Unable to send OTP"
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
        res.status(401).json({
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
        res.status(403).json({
            message: "Invalid OTP"
        })
    }
})

export default otp;