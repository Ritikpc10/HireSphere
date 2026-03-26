import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { profileAndResumeUpload, singleUpload } from "../middleware/multer.js";
import {
  toggleSaveJob,
  getSavedJobs,
} from "../controllers/savedJob.controller.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router
  .route("/profile/update")
  .post(authenticateToken, profileAndResumeUpload, updateProfile);

// Saved jobs
router.route("/save-job/:id").post(authenticateToken, toggleSaveJob);
router.route("/saved-jobs").get(authenticateToken, getSavedJobs);

// Password reset
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;
