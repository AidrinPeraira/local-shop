//import the necesasry packages here
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

//import our utils here
import { connectDB } from './config/db.js'
import exp from 'constants'


dotenv.config() //load dot env data into 'process.env' by default
const port = process.env.PORT || 5000;

connectDB() //estabilish a connection to the db

const app = express() //initialise an instance of express

// load the necessary application level middleware and settings
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//add necessary routing
app.get('/', (req, res)=>{
    res.send('This is a message from the server')
})

//start thr server
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})