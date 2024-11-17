import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async() => {
   await mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
   .then(() => {
    console.log(`MongoDB Connected`)
   })
   .catch((error) => {
    console.log("MongoDB Connection Erorr", error)
   })
}