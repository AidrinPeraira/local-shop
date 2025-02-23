//import the necesasry packages here
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'



//import our utils here
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import verifyRoute from './routes/verifyRoutes.js'



dotenv.config() //load dot env data into 'process.env' by default
const port = process.env.PORT || 5000;
connectDB() //estabilish a connection to the db



const app = express() //initialise an instance of express

// load the necessary application level middleware and settings
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Allow sending cookies
  }))


//add necessary routing
app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/verify', verifyRoute)

//start thr server
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})