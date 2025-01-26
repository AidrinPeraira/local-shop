// This is the file to establish a connection with mongodb database using the uri

import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Succesfully connected to the database')
    } catch (error) {
        console.err(`DB Connection Error: `, error.message)
        process.exit(1) //this will terminate the server with the corresponding error code
    }
}