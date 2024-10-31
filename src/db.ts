import mongoose from 'mongoose'
import { initializeUsers } from './index'
import dotenv from 'dotenv';
dotenv.config();
const myEnv = process.env;
const CONNECTION_STRING = `mongodb+srv://${myEnv.MONGODB_USER}:${myEnv.MONGODB_PWD}@${myEnv.MONGODB_CLUSTER}/${myEnv.MONGODB_DATABASE}`
export const connectDB = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)
    console.log('MongoDB connected successfully to Altlas Cluster 🟢!')
    await initializeUsers();
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
    console.log("jordAAAAAAAAAAAAAAAN")
  }
}
