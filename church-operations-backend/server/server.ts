console.log("Loading server.ts");

import app from "./app";
import connectDB from "./config/connectDB";
import { initBackgroundJobs } from "./jobs/background";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    initBackgroundJobs();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
