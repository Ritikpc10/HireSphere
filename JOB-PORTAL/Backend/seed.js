import bcrypt from "bcryptjs";

import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";

const SAMPLE_COMPANIES = [
  { name: "Nimbus Solutions", description: "Cloud-first product engineering.", location: "Bengaluru", website: "https://nimbus.example" },
  { name: "Aurora Systems", description: "Developer experience & platform tools.", location: "Hyderabad", website: "https://aurora.example" },
  { name: "Vertex Labs", description: "AI + automation for enterprises.", location: "Pune", website: "https://vertex.example" },
];

const SAMPLE_JOBS = [
  { title: "Software Developer", description: "Build and maintain scalable services.", requirements: ["JavaScript", "APIs", "Testing"], salary: "10", location: "Remote", jobType: "Full-time", experienceLevel: 2, position: 3 },
  { title: "Frontend Engineer", description: "Design responsive UIs and improve UX.", requirements: ["React", "Accessibility", "Performance"], salary: "12", location: "Bengaluru", jobType: "Full-time", experienceLevel: 1, position: 4 },
  { title: "DevOps Engineer", description: "Own CI/CD pipelines and infrastructure reliability.", requirements: ["Docker", "CI/CD", "Monitoring"], salary: "14", location: "Hyderabad", jobType: "Full-time", experienceLevel: 3, position: 2 },
  { title: "Cloud Engineer", description: "Deploy and optimize cloud workloads.", requirements: ["AWS", "Terraform", "Cost Optimization"], salary: "16", location: "Pune", jobType: "Full-time", experienceLevel: 2, position: 2 },
  { title: "Backend Engineer", description: "Develop robust server-side components.", requirements: ["Node.js", "MongoDB", "Security"], salary: "13", location: "Remote", jobType: "Full-time", experienceLevel: 2, position: 3 },
  { title: "Full Stack Developer", description: "Ship end-to-end features across the stack.", requirements: ["React", "Express", "MongoDB"], salary: "15", location: "Bengaluru", jobType: "Full-time", experienceLevel: 2, position: 3 },
  { title: "Junior DevOps Engineer", description: "Assist in automation, deployments, and monitoring.", requirements: ["Linux", "Bash", "CI/CD"], salary: "9", location: "Chennai", jobType: "Full-time", experienceLevel: 0, position: 4 },
  { title: "QA Automation Engineer", description: "Automate regression testing and improve quality.", requirements: ["Playwright", "CI", "Test Plans"], salary: "11", location: "Noida", jobType: "Full-time", experienceLevel: 1, position: 2 },
  { title: "Product Engineer", description: "Build user-facing features and iterate fast.", requirements: ["React", "UX", "Metrics"], salary: "14", location: "Gurugram", jobType: "Full-time", experienceLevel: 2, position: 2 },
  { title: "Data Platform Engineer", description: "Support data pipelines and analytics systems.", requirements: ["ETL", "SQL", "Performance"], salary: "17", location: "Remote", jobType: "Full-time", experienceLevel: 3, position: 1 },
  { title: "Security Engineer", description: "Harden systems and build secure workflows.", requirements: ["OWASP", "Threat Modeling", "Auth"], salary: "18", location: "Hyderabad", jobType: "Full-time", experienceLevel: 3, position: 1 },
  { title: "Automation Engineer", description: "Automate workflows using scripts and services.", requirements: ["Node.js", "Scheduling", "Logs"], salary: "10", location: "Pune", jobType: "Full-time", experienceLevel: 1, position: 2 },
];

const ensureRecruiterUser = async () => {
  const existing = await User.findOne({ role: "Recruiter" });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash("Recruiter@123", 10);
  const recruiter = await User.create({
    fullname: "Demo Recruiter",
    email: "recruiter@demosphere.dev",
    phoneNumber: "9999999999",
    password: passwordHash,
    pancard: "ABCDE1234I",
    adharcard: "111122223344",
    role: "Recruiter",
    profile: {
      bio: "Demo recruiter created by seeder.",
      skills: [],
      profilePhoto: "",
      resume: "",
      company: null,
    },
  });
  return recruiter;
};

const ensureCompanies = async (recruiterId) => {
  const existing = await Company.find({ userId: recruiterId });
  if (existing.length > 0) return existing;

  const created = [];
  for (const c of SAMPLE_COMPANIES) {
    const company = await Company.create({
      name: c.name,
      description: c.description,
      location: c.location,
      website: c.website,
      userId: recruiterId,
      logo: "",
    });
    created.push(company);
  }
  return created;
};

export const seedDummyData = async () => {
  const jobsCount = await Job.countDocuments();
  if (jobsCount > 0) return;

  const recruiter = await ensureRecruiterUser();
  const companies = await ensureCompanies(recruiter._id);

  // Create jobs with rotating companies
  const jobsToInsert = SAMPLE_JOBS.map((j, idx) => {
    const company = companies[idx % companies.length];
    return {
      title: j.title,
      description: j.description,
      requirements: j.requirements,
      salary: j.salary,
      experienceLevel: j.experienceLevel,
      location: j.location,
      jobType: j.jobType,
      position: j.position,
      company: company._id,
      created_by: recruiter._id,
      applications: [],
    };
  });

  await Job.insertMany(jobsToInsert);
  console.log(`Seeded ${jobsToInsert.length} dummy jobs.`);
};

export const seedDummyDataForStandalone = async () => {
  await seedDummyData();
};

