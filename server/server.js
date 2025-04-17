//import the necesasry packages here
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from "helmet";
import morgan from 'morgan'
import csrf from 'csrf';
import { initializeCronJobs } from './utils/cronJob.js';




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
import dashboardRouter from './routes/dashboardRoutes.js';
import returnRouter from './routes/returnRoutes.js';
import walletRouter from './routes/walletRoutes.js';
import salesRouter from './routes/salesRoutes.js';


dotenv.config() //load dot env data into 'process.env' by default
const port = process.env.PORT || 5000;
connectDB() //estabilish a connection to the db



const app = express() //initialise an instance of express

// load the necessary application level middleware and settings
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true // 
  }))
app.use(helmet()); // To protect against the xss seAllow sending cookiescurity threarts
app.use(morgan("dev")); // Logs requests in 'dev' format

initializeCronJobs();

//csrf protection

const tokens = new csrf();

app.use((req, res, next) => {
  // Skip CSRF for GET requests and csrf-token endpoint
  if (req.method === 'GET' || req.path === '/api/csrf-token') {
      return next();
  }

  const token = req.headers['x-csrf-token'];
  const secret = req.cookies['csrf-secret'];

  console.log( "token - secrret",token, secret); // Log the received token and secret for analysi  
  

  if (!token || !secret) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  try {
      if (tokens.verify(secret, token)) {
          return next();
      }
      return res.status(403).json({ message: 'Invalid CSRF token' });
  } catch (error) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
  }
});

app.get('/api/csrf-token', (req, res) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  
  res.cookie('csrf-secret', secret, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ csrfToken: token });
});

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

app.use('/api/category', categoryRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist', whishlistRouter)
app.use('/api/orders', orderRouter)
app.use('/api/return', returnRouter)
app.use('/api/coupons', couponRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/payouts', payoutRouter)
app.use('/api/admin', dashboardRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/sales', salesRouter);



//handle errors after evrything is done
app.use(errorHandler)
//start thr server
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})