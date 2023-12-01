import { configDotenv } from "dotenv";
import mongoose, { mongo } from "mongoose";

require("dotenv").config();

export default async function connectMongoDB() {
  try{
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("connected to mongodb");
  } catch(err) {
    console.log("error connecting to mongodb ", err);
  }
}