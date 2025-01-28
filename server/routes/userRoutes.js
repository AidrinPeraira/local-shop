import express from 'express'
import { createUser, loginUser, logoutController, getAllUsers, getCurrentUserProfile, updateCurrentUser } from '../controller/userController.js'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.route('/')
    .post(createUser)
    .get(authenticate, authorizeAdmin, getAllUsers)

userRouter.route('/auth')
    .post(loginUser)

userRouter.route('/logout')
    .post(logoutController)

userRouter.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUser)

export default userRouter