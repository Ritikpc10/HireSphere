import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { JOB_API_ENDPOINT } from "@/utils/data";
import {
  TrendingUp,
  MapPin,
  Briefcase,
  IndianRupee,
  Search,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const SalaryInsights = () => {
  const { token } = useSelector((store) => store.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.success) {
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  // Compute salary insights
  const computeInsights = () => {
    const validJobs = jobs.filter((j) => j.salary && Number(j.salary) > 0);
    if (validJobs.length === 0) return null;

    const salaries = validJobs.map((j) => Number(j.salary));
    const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    const median = salaries.sort((a, b) => a - b)[Math.floor(salaries.length / 2)];

    // By role
    const roleMap = {};
    validJobs.forEach((j) => {
      const title = j.title?.toLowerCase().includes("senior") ? "Senior"
        : j.title?.toLowerCase().includes("lead") ? "Lead"
        : j.title?.toLowerCase().includes("junior") || j.title?.toLowerCase().includes("intern") ? "Junior/Intern"
        : "Mid-level";
      if (!roleMap[title]) roleMap[title] = [];
      roleMap[title].push(Number(j.salary));
    });
    const byRole = Object.entries(roleMap).map(([role, sals]) => ({
      role,
      avg: Math.round(sals.reduce((a, b) => a + b, 0) / sals.length * 10) / 10,
      count: sals.length,
      min: Math.min(...sals),
      max: Math.max(...sals),
    })).sort((a, b) => b.avg - a.avg);

    // By location
    const locMap = {};
    validJobs.forEach((j) => {
      const loc = j.location || "Other";
      if (!locMap[loc]) locMap[loc] = [];
      locMap[loc].push(Number(j.salary));
    });
    const byLocation = Object.entries(locMap).map(([location, sals]) => ({
      location,
      avg: Math.round(sals.reduce((a, b) => a + b, 0) / sals.length * 10) / 10,
      count: sals.length,
    })).sort((a, b) => b.avg - a.avg).slice(0, 8);

    // By job type
    const typeMap = {};
    validJobs.forEach((j) => {
      const type = j.jobType || "Other";
      if (!typeMap[type]) typeMap[type] = [];
      typeMap[type].push(Number(j.salary));
    });
    const byType = Object.entries(typeMap).map(([type, sals]) => ({
      type,
      avg: Math.round(sals.reduce((a, b) => a + b, 0) / sals.length * 10) / 10,
      count: sals.length,
    })).sort((a, b) => b.avg - a.avg);

    return { avg: Math.round(avg * 10) / 10, min, max, median, total: validJobs.length, byRole, byLocation, byType };
  };

  const insights = computeInsights();

  // Search filter for comparator
  const filteredJobs = jobs.filter((j) =>
    search
      ? j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.name?.toLowerCase().includes(search.toLowerCase())
      : false
  ).slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl animate-shimmer bg-card border border-border" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
            <IndianRupee className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Salary Insights</h1>
            <p className="text-sm text-muted-foreground">Market salary data from {insights?.total || 0} job listings</p>
          </div>
        </div>

        {!insights ? (
          <div className="text-center py-16">
            <BarChart3 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No salary data available yet</p>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Average Salary", value: `₹${insights.avg} LPA`, icon: TrendingUp, color: "from-violet-500 to-purple-600" },
                { label: "Highest", value: `₹${insights.max} LPA`, icon: ArrowUpRight, color: "from-green-500 to-emerald-600" },
                { label: "Lowest", value: `₹${insights.min} LPA`, icon: ArrowDownRight, color: "from-orange-500 to-red-500" },
                { label: "Median", value: `₹${insights.median} LPA`, icon: BarChart3, color: "from-blue-500 to-cyan-500" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`opacity-0 animate-fadeSlideIn p-5 rounded-2xl text-white relative overflow-hidden hover-lift`}
                  style={{ animationFillMode: "forwards", animationDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`} />
                  <div className="relative z-10">
                    <stat.icon className="h-5 w-5 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs opacity-80">{stat.label}</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/10" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* By Role Level */}
              <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-200" style={{ animationFillMode: "forwards" }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Salary by Experience Level
                </h3>
                <div className="space-y-4">
                  {insights.byRole.map((item, i) => {
                    const maxAvg = insights.byRole[0]?.avg || 1;
                    const pct = Math.round((item.avg / maxAvg) * 100);
                    return (
                      <div key={item.role}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.role}</span>
                          <span className="text-sm font-bold">₹{item.avg} LPA</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{item.count} jobs • ₹{item.min}–{item.max} LPA range</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* By Location */}
              <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-300" style={{ animationFillMode: "forwards" }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Salary by Location
                </h3>
                <div className="space-y-3">
                  {insights.byLocation.map((item, i) => {
                    const maxAvg = insights.byLocation[0]?.avg || 1;
                    const pct = Math.round((item.avg / maxAvg) * 100);
                    return (
                      <div key={item.location} className="flex items-center gap-3">
                        <span className="text-sm w-24 truncate">{item.location}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-16 text-right">₹{item.avg} LPA</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Salary Comparator */}
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-400" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Salary Comparator
              </h3>
              <Input
                placeholder="Search jobs to compare salaries (e.g. Frontend Developer)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
              />
              {filteredJobs.length > 0 && (
                <div className="space-y-2">
                  {filteredJobs.map((job, i) => (
                    <div key={job._id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards", animationDelay: `${i * 50}ms` }}>
                      <div>
                        <p className="text-sm font-medium">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.company?.name} • {job.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">₹{job.salary} LPA</p>
                        <span className={`text-[10px] ${Number(job.salary) >= insights.avg ? "text-green-500" : "text-red-500"}`}>
                          {Number(job.salary) >= insights.avg ? "↑ Above" : "↓ Below"} avg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalaryInsights;
