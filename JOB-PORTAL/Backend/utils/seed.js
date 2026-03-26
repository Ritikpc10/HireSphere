import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcryptjs";

/**
 * Auto-seed the database with sample data if collections are empty.
 * Idempotent – only runs when the Job collection has 0 documents.
 */
const autoSeed = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount > 0) return; // DB already has data

    console.log("🌱 Seeding database with sample data...");

    // 1. Create a demo recruiter
    const hashedPassword = await bcrypt.hash("password123", 10);
    let recruiter = await User.findOne({ email: "recruiter@demo.com" });
    if (!recruiter) {
      recruiter = await User.create({
        fullname: "Demo Recruiter",
        email: "recruiter@demo.com",
        phoneNumber: "+919876543210",
        password: hashedPassword,
        pancard: "DEMO1234PAN",
        adharcard: "999988887777",
        role: "Recruiter",
        profile: {
          bio: "Demo recruiter account for testing",
          profilePhoto: "",
        },
      });
    }

    // 2. Create 3 companies
    const companyData = [
      {
        name: "TechCorp Solutions",
        description:
          "A leading technology company specializing in enterprise software solutions, cloud infrastructure, and AI-driven products.",
        website: "https://techcorp.example.com",
        location: "Bangalore",
        userId: recruiter._id,
      },
      {
        name: "DataFlow Inc",
        description:
          "Data engineering and analytics firm helping businesses make data-driven decisions with cutting-edge ML pipelines.",
        website: "https://dataflow.example.com",
        location: "Hyderabad",
        userId: recruiter._id,
      },
      {
        name: "CloudNine Systems",
        description:
          "Cloud-native startup building next-gen DevOps tools and serverless platforms for modern development teams.",
        website: "https://cloudnine.example.com",
        location: "Pune",
        userId: recruiter._id,
      },
    ];

    const companies = [];
    for (const data of companyData) {
      let company = await Company.findOne({ name: data.name });
      if (!company) {
        company = await Company.create(data);
      }
      companies.push(company);
    }

    // 3. Create 15 sample jobs
    const jobsData = [
      {
        title: "Senior Software Developer",
        description:
          "Build scalable backend services using Node.js and microservices architecture. Work with cross-functional teams to deliver high-quality products.",
        requirements: ["Node.js", "MongoDB", "Docker", "REST APIs", "Git"],
        salary: "18",
        experienceLevel: 3,
        location: "Bangalore",
        jobType: "Full-Time",
        position: 3,
        company: companies[0]._id,
      },
      {
        title: "Frontend Engineer (React)",
        description:
          "Design and develop responsive user interfaces using React.js and modern CSS frameworks. Collaborate with UX designers.",
        requirements: ["React", "JavaScript", "Tailwind CSS", "Redux", "Git"],
        salary: "14",
        experienceLevel: 2,
        location: "Remote",
        jobType: "Full-Time",
        position: 2,
        company: companies[0]._id,
      },
      {
        title: "Full Stack Developer",
        description:
          "End-to-end development of web applications using the MERN stack. Own features from database design to UI implementation.",
        requirements: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
        salary: "16",
        experienceLevel: 2,
        location: "Bangalore",
        jobType: "Full-Time",
        position: 4,
        company: companies[0]._id,
      },
      {
        title: "DevOps Engineer",
        description:
          "Manage CI/CD pipelines, container orchestration with Kubernetes, and cloud infrastructure on AWS.",
        requirements: [
          "AWS",
          "Docker",
          "Kubernetes",
          "Terraform",
          "Jenkins",
        ],
        salary: "20",
        experienceLevel: 4,
        location: "Pune",
        jobType: "Full-Time",
        position: 2,
        company: companies[2]._id,
      },
      {
        title: "Data Scientist",
        description:
          "Analyze large datasets, build predictive models, and deliver actionable insights using Python and ML frameworks.",
        requirements: [
          "Python",
          "TensorFlow",
          "Pandas",
          "SQL",
          "Statistics",
        ],
        salary: "22",
        experienceLevel: 3,
        location: "Hyderabad",
        jobType: "Full-Time",
        position: 2,
        company: companies[1]._id,
      },
      {
        title: "Cloud Architect",
        description:
          "Design and implement cloud solutions on AWS/Azure. Lead migration projects and establish best practices.",
        requirements: [
          "AWS",
          "Azure",
          "Networking",
          "Security",
          "Microservices",
        ],
        salary: "30",
        experienceLevel: 6,
        location: "Bangalore",
        jobType: "Full-Time",
        position: 1,
        company: companies[2]._id,
      },
      {
        title: "Machine Learning Engineer",
        description:
          "Build and deploy ML models at scale. Work on NLP, computer vision, and recommendation systems.",
        requirements: [
          "Python",
          "PyTorch",
          "MLOps",
          "Docker",
          "Data Pipelines",
        ],
        salary: "25",
        experienceLevel: 3,
        location: "Hyderabad",
        jobType: "Full-Time",
        position: 2,
        company: companies[1]._id,
      },
      {
        title: "Backend Developer (Java)",
        description:
          "Develop high-performance backend systems using Java Spring Boot. Integrate with microservices and messaging queues.",
        requirements: [
          "Java",
          "Spring Boot",
          "Kafka",
          "PostgreSQL",
          "Redis",
        ],
        salary: "17",
        experienceLevel: 3,
        location: "Chennai",
        jobType: "Full-Time",
        position: 3,
        company: companies[0]._id,
      },
      {
        title: "Mobile App Developer",
        description:
          "Build cross-platform mobile applications using React Native. Publish to App Store and Play Store.",
        requirements: [
          "React Native",
          "JavaScript",
          "iOS",
          "Android",
          "Firebase",
        ],
        salary: "15",
        experienceLevel: 2,
        location: "Mumbai",
        jobType: "Full-Time",
        position: 2,
        company: companies[0]._id,
      },
      {
        title: "UI/UX Designer",
        description:
          "Create intuitive user experiences and beautiful interfaces. Conduct user research, wireframing, and prototyping.",
        requirements: [
          "Figma",
          "Adobe XD",
          "User Research",
          "Prototyping",
          "Design Systems",
        ],
        salary: "12",
        experienceLevel: 2,
        location: "Remote",
        jobType: "Full-Time",
        position: 1,
        company: companies[1]._id,
      },
      {
        title: "Cybersecurity Analyst",
        description:
          "Monitor security threats, conduct vulnerability assessments, and implement security measures across infrastructure.",
        requirements: [
          "Network Security",
          "SIEM",
          "Penetration Testing",
          "ISO 27001",
          "Linux",
        ],
        salary: "19",
        experienceLevel: 3,
        location: "Delhi",
        jobType: "Full-Time",
        position: 2,
        company: companies[2]._id,
      },
      {
        title: "QA Automation Engineer",
        description:
          "Design and implement automated test suites for web and API testing. Ensure product quality and reliability.",
        requirements: [
          "Selenium",
          "Jest",
          "Cypress",
          "CI/CD",
          "API Testing",
        ],
        salary: "13",
        experienceLevel: 2,
        location: "Pune",
        jobType: "Full-Time",
        position: 2,
        company: companies[2]._id,
      },
      {
        title: "Data Engineer",
        description:
          "Build and maintain data pipelines and ETL processes. Work with big data technologies and data warehousing.",
        requirements: [
          "Python",
          "Apache Spark",
          "Airflow",
          "SQL",
          "Snowflake",
        ],
        salary: "21",
        experienceLevel: 3,
        location: "Hyderabad",
        jobType: "Full-Time",
        position: 2,
        company: companies[1]._id,
      },
      {
        title: "Product Manager",
        description:
          "Define product roadmap, prioritize features, and work with engineering teams to deliver impactful products.",
        requirements: [
          "Product Strategy",
          "Agile",
          "Data Analysis",
          "Jira",
          "Communication",
        ],
        salary: "24",
        experienceLevel: 5,
        location: "Bangalore",
        jobType: "Full-Time",
        position: 1,
        company: companies[0]._id,
      },
      {
        title: "Frontend Intern",
        description:
          "Learn and contribute to frontend development using React.js. Great opportunity for freshers to gain industry experience.",
        requirements: ["HTML", "CSS", "JavaScript", "React Basics", "Git"],
        salary: "4",
        experienceLevel: 0,
        location: "Remote",
        jobType: "Internship",
        position: 5,
        company: companies[1]._id,
      },
    ];

    for (const jobData of jobsData) {
      await Job.create({
        ...jobData,
        created_by: recruiter._id,
      });
    }

    console.log(
      `✅ Seeded: 1 recruiter, ${companies.length} companies, ${jobsData.length} jobs`
    );
    console.log(`   Recruiter login: recruiter@demo.com / password123`);
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};

export default autoSeed;
