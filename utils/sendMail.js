import nodemailer from "nodemailer"

const sendMail = async (email, subject, text, callBack) => {

    const mailOptions = {
        from: process.env.MAIL_SENDER,
        to: email,
        subject,
        text
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_SENDER,
            pass: process.env.MAIL_PASS
        }
    });
    console.log("function called");
    const res = transporter.sendMail(mailOptions, callBack);
}

export default sendMail
