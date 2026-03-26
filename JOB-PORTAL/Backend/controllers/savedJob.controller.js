import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

// POST /api/user/save-job/:id — toggle save/unsave a job
export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const user = await User.findById(userId);
    const alreadySaved = user.savedJobs.includes(jobId);

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId.toString()
      );
      await user.save();
      return res.status(200).json({
        message: "Job removed from saved",
        saved: false,
        success: true,
      });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({
        message: "Job saved successfully",
        saved: true,
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// GET /api/user/saved-jobs — get all saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "company", select: "name logo location" },
    });

    return res.status(200).json({
      success: true,
      savedJobs: user.savedJobs || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
