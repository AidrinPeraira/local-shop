import express from 'express'
import { createUser, loginUser, logoutController, getAllUsers, getCurrentUserProfile, updateCurrentUser, deleteUserById } from '../controller/userController.js'
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

    //admin actions below
userRouter.route('/:id')
    .delete(authenticate, authorizeAdmin, deleteUserById)

export default userRouter