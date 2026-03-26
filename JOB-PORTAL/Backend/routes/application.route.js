import express from "express";

import authenticateToken from "../middleware/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(authenticateToken, applyJob);
router.route("/apply/:id").post(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
// Alias for the real-world recruiter dashboard API
router.route("/job/:id").get(authenticateToken, getApplicants);
router.route("/:id/applicants").get(authenticateToken, getApplicants);
router.route("/status/:id/update").post(authenticateToken, updateStatus);
router.route("/status/:id").put(authenticateToken, updateStatus);

export default router;
