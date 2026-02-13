console.log("Loading server.ts");

import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/connectDB";

//debug line


dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
});
