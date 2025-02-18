import express from 'express'
import { sendOTP } from '../controller/otpController.js'

const verifyRoute = express.Router()

verifyRoute.route('/email')
    .get(sendOTP)


export default verifyRoute