//import the necesasry packages here
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from "helmet";
import morgan from 'morgan'
import csrf from 'csrf';



//import our utils here
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import verifyRouter from './routes/verifyRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'
import sellerRouter from './routes/sellerRoutes.js';
import { errorHandler } from './middlewares/errorHandlerMiddleware.js';
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import whishlistRouter from './routes/whishlistRoutes.js'
import couponRouter from './routes/couponRoutes.js'
import transactionRouter from './routes/transactionRoutes.js'
import { checkUserBlocked } from './middlewares/authRestrictionMiddleware.js';
import payoutRouter from './routes/payoutRoutes.js';


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

//csrf protection

const tokens = new csrf();
app.use((req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
      return next()
  }

  // Get the token from the request header
  const token = req.headers['x-csrf-token']
  
  // Get the secret from the cookie or create a new one
  let secret = req.cookies['csrf-secret']
  if (!secret) {
      secret = tokens.secretSync()
      res.cookie('csrf-secret', secret, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
      })
  }

  // Validate the token
  if (!token || !tokens.verify(secret, token)) {
      return res.status(403).json({ message: 'Invalid CSRF token' })
  }

  next()
})

app.get('/api/csrf-token', (req, res) => {
  const secret = tokens.secretSync()
  const token = tokens.create(secret)
  
  res.cookie('csrf-secret', secret, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
  })
  
  res.json({ csrfToken: token })
})

//google auth crooss-origin error fix
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy"); // Remove COOP
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); // Allow popups
  next();
});

app.use(checkUserBlocked);


//add necessary routing
app.use('/api/users', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/admin', adminRouter)
app.use('/api/verify', verifyRouter)

//actions to manipulate categories
app.use('/api/category', categoryRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist', whishlistRouter)
app.use('/api/orders', orderRouter)
app.use('/api/coupons', couponRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/transactions', payoutRouter)



//handle errors after evrything is done
app.use(errorHandler)
//start thr server
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})