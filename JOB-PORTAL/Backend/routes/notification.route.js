import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getNotifications,
  markAllRead,
  markOneRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/").get(authenticateToken, getNotifications);
router.route("/read-all").put(authenticateToken, markAllRead);
router.route("/:id/read").put(authenticateToken, markOneRead);

export default router;
