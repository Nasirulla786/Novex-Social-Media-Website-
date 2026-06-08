import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const sendMail = async(to,otp)=>{
    transporter.sendMail({
        from:`${process.env.EMAIL}`,
        to:to,
        html:`<p>Hello Nasirulla this side <br> ${otp}</p>`
    })

}

export default sendMail;
