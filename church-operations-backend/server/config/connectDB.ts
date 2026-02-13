
import mongoose from "mongoose";

console.log("Loading connectDB.ts");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if DB fails
  }
};

export default connectDB;
