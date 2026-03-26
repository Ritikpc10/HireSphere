import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import roleGuard from "../middleware/roleGuard.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(authenticateToken, roleGuard("Recruiter"), postJob);
router.route("/get").get(getAllJobs);
router
  .route("/getadminjobs")
  .get(authenticateToken, roleGuard("Recruiter"), getAdminJobs);
router.route("/get/:id").get(getJobById);

export default router;
