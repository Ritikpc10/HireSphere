import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { useSelector } from "react-redux";
import { DASHBOARD_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Award,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// ── Animated Counter Hook ──
const useCounter = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 30)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

// ── Stat Card ──
const StatCard = ({ icon: Icon, label, value, color, delay, gradient }) => {
  const animatedValue = useCounter(value);
  return (
    <div
      className={`opacity-0 animate-fadeSlideIn ${delay} p-6 rounded-2xl border border-border hover-lift cursor-default overflow-hidden relative`}
      style={{
        animationFillMode: "forwards",
        background: `linear-gradient(135deg, ${gradient})`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Sparkles className="h-4 w-4 text-white/50 animate-pulseScale" />
        </div>
        <p className="text-3xl font-bold stat-number text-white">{animatedValue}</p>
        <p className="text-sm text-white/80 mt-1">{label}</p>
      </div>
      {/* Decorative circle */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10" />
    </div>
  );
};

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((store) => store.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${DASHBOARD_API_ENDPOINT}/recruiter`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-2xl animate-shimmer bg-card border border-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalJobs: 0,
    totalApplicants: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    totalCompanies: 0,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ── Welcome Header ── */}
        <div className="opacity-0 animate-fadeSlideIn mb-8" style={{ animationFillMode: "forwards" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Recruiter Dashboard <span className="animate-pulseScale inline-block">📊</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, <span className="text-primary font-semibold">{user?.fullname}</span>
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Post New Job
            </Button>
          </div>
        </div>

        {/* ── Stat Cards with Gradient Backgrounds ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            label="Jobs Posted"
            value={stats.totalJobs}
            gradient="hsl(262 55% 52%), hsl(262 55% 40%)"
            delay="delay-100"
          />
          <StatCard
            icon={Users}
            label="Total Applicants"
            value={stats.totalApplicants}
            gradient="hsl(210 100% 50%), hsl(210 100% 38%)"
            delay="delay-200"
          />
          <StatCard
            icon={CheckCircle2}
            label="Accepted"
            value={stats.accepted}
            gradient="hsl(142 76% 36%), hsl(142 76% 28%)"
            delay="delay-300"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            gradient="hsl(0 84% 60%), hsl(0 84% 48%)"
            delay="delay-400"
          />
        </div>

        {/* ── Secondary Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="opacity-0 animate-fadeSlideIn delay-300 p-5 rounded-2xl bg-card border border-border hover-lift" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold stat-number">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="opacity-0 animate-fadeSlideIn delay-400 p-5 rounded-2xl bg-card border border-border hover-lift" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold stat-number">{stats.totalCompanies}</p>
                <p className="text-xs text-muted-foreground">Companies</p>
              </div>
            </div>
          </div>
          <div className="opacity-0 animate-fadeSlideIn delay-500 p-5 rounded-2xl bg-card border border-border hover-lift col-span-2 md:col-span-1" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold stat-number">
                  {stats.totalApplicants > 0 && stats.totalJobs > 0
                    ? Math.round(stats.totalApplicants / stats.totalJobs)
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">Avg. Applicants/Job</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Application Analytics Chart ── */}
        <div className="opacity-0 animate-fadeSlideIn delay-300 mb-8 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Application Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">Application Status Distribution</p>
              <div className="space-y-4">
                {[
                  { label: "Accepted", value: stats.accepted, color: "from-green-400 to-emerald-500", bg: "bg-green-500/10" },
                  { label: "Pending", value: stats.pending, color: "from-yellow-400 to-amber-500", bg: "bg-yellow-500/10" },
                  { label: "Rejected", value: stats.rejected, color: "from-red-400 to-rose-500", bg: "bg-red-500/10" },
                ].map((item, i) => {
                  const maxVal = Math.max(stats.accepted, stats.pending, stats.rejected, 1);
                  const pct = Math.round((item.value / maxVal) * 100);
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${pct}%`, animationDelay: `${i * 200}ms` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut-style summary */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-4">Conversion Rate</p>
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                  {stats.totalApplicants > 0 && (
                    <>
                      <circle
                        cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                        className="text-green-500"
                        strokeDasharray={`${(stats.accepted / stats.totalApplicants) * 251} 251`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 1s ease-out" }}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {stats.totalApplicants > 0
                      ? Math.round((stats.accepted / stats.totalApplicants) * 100)
                      : 0}%
                  </span>
                  <span className="text-xs text-muted-foreground">Acceptance</span>
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Accepted</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Pending</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Rejected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ── Top Performing Jobs ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-400 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Top Performing Jobs
            </h3>
            {data?.topJobs?.length > 0 ? (
              <div className="space-y-3">
                {data.topJobs.map((job, i) => {
                  const maxCount = data.topJobs[0]?.count || 1;
                  const pct = Math.round((job.count / maxCount) * 100);
                  return (
                    <div
                      key={i}
                      className="opacity-0 animate-slideInRight p-3 rounded-xl bg-muted/50 hover-lift"
                      style={{
                        animationFillMode: "forwards",
                        animationDelay: `${(i + 1) * 120}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {job.count} applicants
                        </Badge>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary animate-progressFill"
                          style={{
                            "--progress-width": `${pct}%`,
                            width: `${pct}%`,
                            animationDelay: `${(i + 2) * 120}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Post jobs to see performance data</p>
              </div>
            )}
          </div>

          {/* ── Recent Applicants ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-500 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Recent Applicants
            </h3>
            {data?.recentApplicants?.length > 0 ? (
              <div className="space-y-3">
                {data.recentApplicants.map((app, i) => (
                  <div
                    key={app._id}
                    className="opacity-0 animate-slideInRight flex items-center justify-between p-3 rounded-xl bg-muted/50 hover-lift"
                    style={{
                      animationFillMode: "forwards",
                      animationDelay: `${(i + 1) * 120}ms`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {app.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{app.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Applied for {app.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          app.status === "accepted"
                            ? "default"
                            : app.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs capitalize"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No applicants yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="opacity-0 animate-fadeSlideIn delay-600 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animationFillMode: "forwards" }}>
          {[
            { label: "Post a Job", path: "/admin/jobs/create", icon: PlusCircle, color: "from-violet-500 to-purple-600" },
            { label: "My Jobs", path: "/admin/jobs", icon: Briefcase, color: "from-blue-500 to-cyan-500" },
            { label: "Companies", path: "/admin/companies", icon: Building2, color: "from-orange-500 to-amber-500" },
            { label: "Add Company", path: "/admin/companies/create", icon: PlusCircle, color: "from-green-500 to-emerald-500" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group p-4 rounded-2xl bg-card border border-border hover-lift text-left transition-all duration-300"
            >
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${action.color} w-fit mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <p className="font-medium text-sm">{action.label}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
