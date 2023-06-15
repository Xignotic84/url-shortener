import mongoose from 'mongoose'
import './../models'

export default async () => await mongoose.connect(process.env.MONGO_DATABSE_URI)
