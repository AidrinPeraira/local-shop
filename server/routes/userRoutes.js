import express from 'express'
import { createUser, loginUser, logoutController, getAllUsers, getCurrentUserProfile, updateCurrentUser, deleteUserById, getUserById, updateUserById } from '../controller/userController.js'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.route('/register')
    .post(createUser)

userRouter.route('/auth')
    .post(loginUser)

userRouter.route('/logout')
    .post(logoutController)

userRouter.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUser)

    //admin actions below

userRouter.route('/')
    .get(authenticate, authorizeAdmin, getAllUsers)

userRouter.route('/:id')
    .delete(authenticate, authorizeAdmin, deleteUserById)
    .get(authenticate, authorizeAdmin, getUserById)
    .put(authenticate, authorizeAdmin, updateUserById)

export default userRouter