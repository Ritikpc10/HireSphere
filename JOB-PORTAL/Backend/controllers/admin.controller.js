import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";

// Middleware: check if user is admin (first registered user or specific emails)
export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    // Admin = first user in DB or role-based check
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    if (!user || (user._id.toString() !== firstUser._id.toString() && user.role !== "Admin")) {
      return res.status(403).json({ message: "Admin access required", success: false });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// GET /api/admin/stats — platform-wide statistics
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, totalCompanies] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        Company.countDocuments(),
      ]);

    const students = await User.countDocuments({ role: "Student" });
    const recruiters = await User.countDocuments({ role: "Recruiter" });

    const accepted = await Application.countDocuments({ status: "accepted" });
    const rejected = await Application.countDocuments({ status: "rejected" });
    const pending = await Application.countDocuments({ status: "pending" });

    // Recent users (last 10)
    const recentUsers = await User.find()
      .select("fullname email role createdAt profile.profilePhoto")
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent jobs (last 10)
    const recentJobs = await Job.find()
      .populate("company", "name logo")
      .select("title location jobType salary createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    // Growth stats (users per month for last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        students,
        recruiters,
        accepted,
        rejected,
        pending,
      },
      recentUsers,
      recentJobs,
      userGrowth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// GET /api/admin/users — get all users with pagination
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const role = req.query.role;
    const search = req.query.search;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -resetPasswordToken -resetPasswordExpires")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      users,
      totalCount: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// DELETE /api/admin/users/:id — delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    // Clean up applications
    await Application.deleteMany({ applicant: userId });
    return res.status(200).json({ message: "User deleted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// DELETE /api/admin/jobs/:id — delete a job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    await Application.deleteMany({ job: jobId });
    return res.status(200).json({ message: "Job deleted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};
