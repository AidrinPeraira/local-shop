import express from 'express'
import { createUser, loginUser, logoutController, getAllUsers } from '../controller/userController.js'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.route('/')
    .post(createUser)

userRouter.route('/auth')
    .post(loginUser)

userRouter.route('/logout')
    .post(logoutController)

export default userRouter