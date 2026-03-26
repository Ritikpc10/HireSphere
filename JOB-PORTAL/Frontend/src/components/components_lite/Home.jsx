import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search Jobs",
      desc: "Browse through thousands of curated job listings across industries",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: FileText,
      title: "Build Profile",
      desc: "Create your professional profile with skills, resume, and portfolio",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Send,
      title: "Apply Instantly",
      desc: "One-click applications to jobs that match your skills and interests",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: CheckCircle2,
      title: "Get Hired",
      desc: "Track your applications and land your dream job faster",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="py-16 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            How <span className="text-dual-gradient">It Works</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Land your dream job in 4 simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`opacity-0 animate-fadeSlideIn p-6 rounded-2xl bg-card border border-border hover-lift text-center relative group`}
              style={{
                animationFillMode: "forwards",
                animationDelay: `${(i + 1) * 150}ms`,
              }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                {i + 1}
              </div>
              <div
                className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
              {/* Connector arrow (hidden on last) */}
              {i < 3 && (
                <ArrowRight className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { loading, error } = useGetAllJobs();
  const jobs = useSelector((state) => state.jobs.allJobs);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/dashboard");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <Header />
      <Categories />
      <HowItWorks />
      {loading && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl animate-shimmer bg-card border border-border" />
            ))}
          </div>
        </div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-xl text-destructive"
        >
          Error: {error}
        </motion.p>
      )}
      {!loading && !error && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <LatestJobs jobs={jobs} />
        </motion.div>
      )}
      <Footer />
    </motion.div>
  );
};

export default Home;
