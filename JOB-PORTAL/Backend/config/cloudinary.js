import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure env vars are available during module initialization.
// (ESM imports execute before `index.js` calls `dotenv.config()`.)
dotenv.config();

/**
 * Cloudinary configuration.
 * Accepts both legacy env names and requested names.
 */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY || process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET || process.env.API_SECRET,
});

export default cloudinary;

