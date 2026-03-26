import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

/**
 * Connect to MongoDB (Atlas when `MONGO_URI` is set).
 * Falls back to in-memory Mongo for local dev when `ALLOW_INMEMORY_DB=true`.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const allowInMemory = process.env.ALLOW_INMEMORY_DB !== "false";

  try {
    if (!mongoUri) {
      if (!allowInMemory) {
        throw new Error("MONGO_URI is missing and in-memory fallback is disabled");
      }

      if (!memoryServer) {
        memoryServer = await MongoMemoryServer.create();
      }
      const uri = memoryServer.getUri("hiresphere");
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log("MongoDB Connected (in-memory dev)...");
      return;
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB Connected (Atlas)...");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    if (allowInMemory) {
      console.log("Falling back to in-memory MongoDB...");
      if (!memoryServer) {
        memoryServer = await MongoMemoryServer.create();
      }
      const uri = memoryServer.getUri("hiresphere");
      await mongoose.connect(uri);
      console.log("MongoDB Connected (in-memory dev)...");
      return;
    }

    throw error;
  }
};

export default connectDB;

