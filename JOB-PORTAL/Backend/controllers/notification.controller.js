import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

// GET /api/notifications — get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// PUT /api/notifications/read-all — mark all as read
export const markAllRead = async (req, res) => {
  try {
    const userId = req.id;
    await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );
    return res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// PUT /api/notifications/:id/read — mark one as read
export const markOneRead = async (req, res) => {
  try {
    const notifId = req.params.id;
    const userId = req.id;
    const notif = await Notification.findOneAndUpdate(
      { _id: notifId, user: userId },
      { $set: { read: true } },
      { new: true }
    );
    if (!notif) {
      return res.status(404).json({ message: "Notification not found", success: false });
    }
    return res.status(200).json({ success: true, notification: notif });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Utility: create a notification (used internally by other controllers)
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  link = "",
  metadata = {},
}) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
      metadata,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
