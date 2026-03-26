import { User } from "../models/user.model.js";

/**
 * Role-based access control middleware.
 * Usage: roleGuard("Recruiter") — only allows users with the Recruiter role.
 */
const roleGuard = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.id).select("role");
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found", success: false });
      }
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient role.", success: false });
      }
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error checking role", success: false });
    }
  };
};

export default roleGuard;
