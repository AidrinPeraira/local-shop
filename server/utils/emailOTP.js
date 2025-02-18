import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config()

const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    service : "gmail",
    port : 587,
    auth : {
        user : process.env.GOOGLE_MAIL,
        pass : process.env.GOOGLE_APP_PWD
    }
})

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTPEmail = async (email, OTP) => {
    try{
        await transporter.sendMail({
            from : process.env.GOOGLE_MAIL,
            to : email,
            subject : "localShop email OTP verification",
            text : `Your OTP code is : ${OTP}` 
        })
    } catch (error) {
        console.error("Error sending OTP Email: ", error)
    }
}

