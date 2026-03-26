import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "./notification.controller.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "Student") {
      return res.status(403).json({
        message: "Only students can apply for jobs",
        success: false,
      });
    }

    // check if the user already has applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    //check if the job exists or not
    const job = await Job.findById(jobId).populate("company", "name");
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    // create a new application

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    // Notify the recruiter about new applicant
    await createNotification({
      userId: job.created_by,
      type: "new_applicant",
      title: "New Applicant",
      message: `${user.fullname} applied for ${job.title}`,
      link: `/admin/jobs/${jobId}/applicants`,
    });

    // Notify the student about successful application
    await createNotification({
      userId,
      type: "application_submitted",
      title: "Application Submitted",
      message: `You applied for ${job.title} at ${job.company?.name || "a company"}`,
      link: `/description/${jobId}`,
    });

    return res
      .status(201)
      .json({ message: "Application submitted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "Student") {
      return res.status(403).json({
        message: "Only students can view applied jobs",
        success: false,
      });
    }

    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const recruiter = await User.findById(userId);
    if (!recruiter || recruiter.role !== "Recruiter") {
      return res.status(403).json({
        message: "Only recruiters can view applicants",
        success: false,
      });
    }

    const job = await Job.findOne({ _id: jobId, created_by: userId }).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant", options: { sort: { createdAt: -1 } } },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    const userId = req.id;
    const recruiter = await User.findById(userId);
    if (!recruiter || recruiter.role !== "Recruiter") {
      return res.status(403).json({
        message: "Only recruiters can update application status",
        success: false,
      });
    }

    const allowed = ["pending", "accepted", "rejected"];
    const normalized = String(status).toLowerCase();
    if (!allowed.includes(normalized)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findById(applicationId).populate({
      path: "job",
      select: "created_by",
    });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    if (!application.job || String(application.job.created_by) !== String(userId)) {
      return res.status(403).json({
        message: "You don't have permission to update this application",
        success: false,
      });
    }

    // update the status
    application.status = normalized;
    await application.save();

    // Notify the applicant about status change
    const jobTitle = application.job?.title || "a job";
    if (normalized === "accepted" || normalized === "rejected") {
      await createNotification({
        userId: application.applicant,
        type: normalized === "accepted" ? "application_accepted" : "application_rejected",
        title: `Application ${normalized.charAt(0).toUpperCase() + normalized.slice(1)}`,
        message: `Your application for ${jobTitle} has been ${normalized}`,
        link: `/dashboard`,
      });
    }

    return res
      .status(200)
      .json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
