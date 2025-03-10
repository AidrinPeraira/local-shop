//import the necesasry packages here
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from "helmet";
import morgan from 'morgan'



//import our utils here
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import verifyRouter from './routes/verifyRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import sellerRouter from './routes/sellerRoutes.js';
import productRouter from './routes/productRoutes.js';
import { errorHandler } from './middlewares/errorHandlerMiddleware.js';



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
    credentials: true // 
  }))
app.use(helmet()); // To protect against the xss seAllow sending cookiescurity threarts
app.use(morgan("dev")); // Logs requests in 'dev' format


//google auth crooss-origin error fix
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy"); // Remove COOP
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); // Allow popups
  next();
});


//add necessary routing
app.use('/api/users', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/admin', adminRouter)
app.use('/api/verify', verifyRouter)

//actions to manipulate categories
app.use('/api/category', categoryRouter)
app.use('/api/products', productRouter)



//handle errors after evrything is done
app.use(errorHandler)
//start thr server
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})