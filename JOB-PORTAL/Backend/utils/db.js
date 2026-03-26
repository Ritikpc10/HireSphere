import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import autoSeed from "./seed.js";

let memoryServer;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("✅ MongoDB Connected (Atlas)");
    await autoSeed();
  } catch (error) {
    console.error("MongoDB Atlas error:", error.message);
    const allowInMemory = process.env.ALLOW_INMEMORY_DB !== "false";
    if (allowInMemory && !memoryServer) {
      console.log("⚠️  Falling back to in-memory MongoDB...");
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri("hiresphere");
      await mongoose.connect(uri);
      console.log("✅ MongoDB Connected (in-memory)");
      await autoSeed();
      return;
    }

    const retryMs = Number(process.env.MONGO_RETRY_MS || 5000);
    console.log(`Retrying MongoDB connection in ${retryMs}ms...`);
    setTimeout(() => {
      connectDB().catch(() => {});
    }, retryMs);
  }
};

export default connectDB;
