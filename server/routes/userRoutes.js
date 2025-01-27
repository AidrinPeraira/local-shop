import express from 'express'
import { createUser, loginUser, logoutController } from '../controller/userController.js'

const userRouter = express.Router()

userRouter.route('/')
    .post(createUser)

userRouter.route('/auth')
    .post(loginUser)

userRouter.route('/logout')
    .post(logoutController)

export default userRouter