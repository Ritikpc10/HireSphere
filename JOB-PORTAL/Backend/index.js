import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import notificationRoute from "./routes/notification.route.js";
import adminRoute from "./routes/admin.route.js";
import { seedDummyData } from "./seed.js";
import rateLimit from "express-rate-limit";

dotenv.config({});
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
    : ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth requests per window
  message: { message: "Too many requests, please try again later", success: false },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { message: "Too many requests, please try again later", success: false },
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = process.env.PORT || 5011;

//api's
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);
app.use("/api/user/forgot-password", authLimiter);
app.use("/api/user/reset-password", authLimiter);

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", apiLimiter, jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/admin", adminRoute);

// Also mount plural routes used by some frontends
app.use("/api/users", userRoute);
app.use("/api/jobs", apiLimiter, jobRoute);
app.use("/api/applications", applicationRoute);


const start = async () => {
  await connectDB();
  if (process.env.SEED_DUMMY_JOBS !== "false") {
    await seedDummyData();
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
