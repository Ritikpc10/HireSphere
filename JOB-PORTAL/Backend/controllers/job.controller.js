import { Job } from "../models/job.model.js";

// Admin/Recruiter: post a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    res.status(201).json({
      message: "Job posted successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// All users: get all jobs with advanced filters
export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword = "",
      location,
      jobType,
      salaryMin,
      salaryMax,
      experience,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Keyword search
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Job type filter
    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = Number(salaryMin);
      if (salaryMax) query.salary.$lte = Number(salaryMax);
    }

    // Experience level filter
    if (experience) {
      query.experienceLevel = { $lte: Number(experience) };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, totalCount] = await Promise.all([
      Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      jobs: jobs || [],
      totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// All users: get job by ID (with applications populated)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({ path: "applications" })
      .populate({ path: "company" });
    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found", success: false });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Admin/Recruiter: get all jobs created by this recruiter
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate({ path: "company" })
      .sort({ createdAt: -1 });
    if (!jobs || jobs.length === 0) {
      return res
        .status(200)
        .json({ jobs: [], message: "No jobs found", success: true });
    }
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
