import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getStudentDashboard,
  getRecruiterDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.route("/student").get(authenticateToken, getStudentDashboard);
router.route("/recruiter").get(authenticateToken, getRecruiterDashboard);

export default router;
