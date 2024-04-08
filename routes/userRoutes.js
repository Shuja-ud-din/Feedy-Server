import express from "express";
import nodemailer from "nodemailer";
import User from "../models/UserModal.js";
import jsonwebtoken from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import CPToken from "../models/CPTokenModal.js";
import getLastRecord from "../utils/getLastRecord.js";
import sendMail from "../utils/sendMail.js";

const userRoutes = express.Router();

userRoutes.post("/singup", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const emailExist = await User.findOne({ email });
  const phNoExist = await User.findOne({ phoneNumber });
  if (emailExist || phNoExist) {
    res.status(201).json({
      success: false,
      message: `${emailExist ? "Email" : "Phone Number"} already Taken`,
    });
    return;
  }

  const lastUser = await getLastRecord(User);

  const user = await User.create({
    id: lastUser ? lastUser.id + 1 : 1,
    name,
    email,
    password,
    phoneNumber,
    isVerifed: false,
    role: "User",
    otp: null,
  });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  if (user) {
    user.otp = otp;
    await user.save();
    sendMail(email, "OTP", otp, (error) => {
      if (error) {
        res.json({
          success: false,
          message: "Email address not found.",
        });
        return;
      }
    });
    res.status(200).json({
      success: true,
      message: "User added successfully",
    });
  } else {
    res.status(201).json({
      success: false,
      message: "User not added",
    });
  }
});

userRoutes.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(202).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  // if (!user.isVerifed) {
  //     res.status(201).json({
  //         message: "User not Verfied"
  //     })
  //     return;
  // }

  if (password === user.password) {
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Incorrect Password",
    });
  }
});

userRoutes.post("/forgetPassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  const tokenObj = await CPToken.findOne({ email });

  if (!user) {
    res.status(200).json({
      success: false,
      message: "email not registered",
    });
    return;
  }

  const token = generateToken();

  const changePasswordLink = `https://feedy-eta.vercel.app/SignIn/resetPassword/${user.id}/${token}`;

  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject: "Change Password",
    text: changePasswordLink,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASS,
    },
  });

  const changeToken = async () => {
    tokenObj.token = token;
    tokenObj.expiration_time = Date.now() + 600000;
    await tokenObj.save();
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      res.status(201).json({
        success: false,
        message: "Unable to send Mail",
        error: error.message,
      });
    } else {
      tokenObj
        ? await changeToken()
        : await CPToken.create({
            userId: user.id,
            token: token,
            email,
            expiration_time: Date.now() + 600000,
          });
      res.status(200).json({
        success: true,
        message: `Change Password Link sent to ${email}`,
      });
    }
  });
});

userRoutes.put("/resetPassword", async (req, res) => {
  const { token, password, userId } = req.body;

  const tokenObj = await CPToken.findOne({ userId });

  if (!tokenObj) {
    res.status(201).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  if (
    tokenObj.token === token &&
    Date.now().toString() < tokenObj.expiration_time
  ) {
    const user = await User.findOne({ id: userId });
    user.password = password;
    await user.save();
    await CPToken.deleteOne({ userId });
    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } else {
    await CPToken.deleteOne({ userId });
    res.status(201).json({
      success: false,
      message: "Token Expired",
    });
  }
});

export default userRoutes;
