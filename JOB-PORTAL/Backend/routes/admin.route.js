import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  isAdmin,
  getAdminStats,
  getAllUsers,
  deleteUser,
  deleteJob,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.route("/stats").get(getAdminStats);
router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser);
router.route("/jobs/:id").delete(deleteJob);

export default router;
