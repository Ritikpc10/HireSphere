import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";

// GET /api/dashboard/student — student stats
export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.id;

    // Get all applications by this user
    const applications = await Application.find({ applicant: userId })
      .populate({
        path: "job",
        populate: { path: "company", select: "name logo" },
      })
      .sort({ createdAt: -1 });

    const total = applications.length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const pending = applications.filter((a) => a.status === "pending").length;

    // Recent 5 applications
    const recentApplications = applications.slice(0, 5).map((app) => ({
      _id: app._id,
      jobTitle: app.job?.title || "Unknown",
      companyName: app.job?.company?.name || "Unknown",
      companyLogo: app.job?.company?.logo || "",
      status: app.status,
      appliedAt: app.createdAt,
    }));

    // Top job categories (by title keywords)
    const allJobs = await Job.find().select("title jobType location");
    const categoryMap = {};
    allJobs.forEach((job) => {
      const type = job.jobType || "Other";
      categoryMap[type] = (categoryMap[type] || 0) + 1;
    });
    const trendingCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Popular locations
    const locationMap = {};
    allJobs.forEach((job) => {
      const loc = job.location || "Other";
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return res.status(200).json({
      success: true,
      stats: { total, accepted, rejected, pending },
      recentApplications,
      trendingCategories,
      topLocations,
      totalJobsAvailable: allJobs.length,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", success: false });
  }
};

// GET /api/dashboard/recruiter — recruiter stats
export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.id;

    // Jobs posted by this recruiter
    const jobs = await Job.find({ created_by: recruiterId })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    const jobIds = jobs.map((j) => j._id);

    // All applications for recruiter's jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "fullname email profile")
      .populate({
        path: "job",
        select: "title company",
        populate: { path: "company", select: "name" },
      })
      .sort({ createdAt: -1 });

    const totalApplicants = applications.length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const pending = applications.filter((a) => a.status === "pending").length;

    // Top jobs by applicant count
    const jobApplicantMap = {};
    applications.forEach((app) => {
      const jobId = app.job?._id?.toString();
      if (jobId) {
        if (!jobApplicantMap[jobId]) {
          jobApplicantMap[jobId] = {
            title: app.job?.title,
            company: app.job?.company?.name,
            count: 0,
          };
        }
        jobApplicantMap[jobId].count++;
      }
    });
    const topJobs = Object.values(jobApplicantMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent 5 applicants
    const recentApplicants = applications.slice(0, 5).map((app) => ({
      _id: app._id,
      name: app.applicant?.fullname || "Unknown",
      email: app.applicant?.email || "",
      jobTitle: app.job?.title || "Unknown",
      company: app.job?.company?.name || "Unknown",
      status: app.status,
      appliedAt: app.createdAt,
    }));

    // Companies owned
    const companies = await Company.find({ userId: recruiterId }).select(
      "name logo"
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs: jobs.length,
        totalApplicants,
        accepted,
        rejected,
        pending,
        totalCompanies: companies.length,
      },
      topJobs,
      recentApplicants,
      companies: companies.map((c) => ({ name: c.name, logo: c.logo })),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", success: false });
  }
};
