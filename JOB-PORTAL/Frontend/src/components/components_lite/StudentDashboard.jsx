import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { DASHBOARD_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  MapPin,
  ArrowRight,
  User,
  FileText,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// ── Animated Counter Hook ──
const useCounter = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
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
const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const animatedValue = useCounter(value);
  return (
    <div
      className={`opacity-0 animate-fadeSlideIn ${delay} p-6 rounded-2xl bg-card border border-border hover-lift cursor-default`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <Sparkles className="h-4 w-4 text-muted-foreground animate-pulseScale" />
      </div>
      <p className="text-3xl font-bold stat-number">{animatedValue}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

// ── Progress Bar ──
const ProgressBar = ({ percentage, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-primary">{percentage}%</span>
    </div>
    <div className="h-3 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary animate-progressFill"
        style={{ "--progress-width": `${percentage}%`, width: `${percentage}%` }}
      />
    </div>
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((store) => store.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${DASHBOARD_API_ENDPOINT}/student`, {
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

  // Calculate profile completion
  const profileCompletion = (() => {
    if (!user) return 0;
    let filled = 0;
    let total = 7;
    if (user.fullname) filled++;
    if (user.email) filled++;
    if (user.phoneNumber) filled++;
    if (user.profile?.bio) filled++;
    if (user.profile?.skills?.length > 0) filled++;
    if (user.profile?.resume) filled++;
    if (user.profile?.profilePhoto) filled++;
    return Math.round((filled / total) * 100);
  })();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl animate-shimmer bg-card border border-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { total: 0, accepted: 0, rejected: 0, pending: 0 };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ── Welcome Header ── */}
        <div className="opacity-0 animate-fadeSlideIn mb-8" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20 animate-scaleIn">
              <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.fullname?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, <span className="text-primary">{user?.fullname?.split(" ")[0]}</span>! 👋
              </h1>
              <p className="text-muted-foreground">Here's your job search overview</p>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard icon={Briefcase} label="Jobs Applied" value={stats.total} color="#7c3aed" delay="delay-100" />
          <StatCard icon={CheckCircle2} label="Accepted" value={stats.accepted} color="#16a34a" delay="delay-200" />
          <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="#dc2626" delay="delay-300" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="#f59e0b" delay="delay-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ── Profile Completion ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-300 lg:col-span-1 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Completion
            </h3>
            <ProgressBar percentage={profileCompletion} label="Your profile" />
            {profileCompletion < 100 && (
              <div className="mt-4 space-y-2">
                {!user?.profile?.bio && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-secondary" /> Add a bio
                  </p>
                )}
                {(!user?.profile?.skills || user.profile.skills.length === 0) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-secondary" /> Add skills
                  </p>
                )}
                {!user?.profile?.resume && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-secondary" /> Upload resume
                  </p>
                )}
                {!user?.profile?.profilePhoto && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-secondary" /> Add profile photo
                  </p>
                )}
              </div>
            )}
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => navigate("/Profile")}
            >
              Edit Profile
            </Button>
          </div>

          {/* ── Recent Applications ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-400 lg:col-span-2 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Recent Applications
            </h3>
            {data?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {data.recentApplications.map((app, index) => (
                  <div
                    key={app._id}
                    className={`opacity-0 animate-slideInRight flex items-center justify-between p-3 rounded-xl bg-muted/50 hover-lift`}
                    style={{
                      animationFillMode: "forwards",
                      animationDelay: `${(index + 1) * 100}ms`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">{app.companyName}</p>
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
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No applications yet</p>
                <Button className="mt-3" onClick={() => navigate("/Jobs")}>
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ── Trending Categories ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-500 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Trending Categories
            </h3>
            {data?.trendingCategories?.length > 0 ? (
              <div className="space-y-3">
                {data.trendingCategories.map((cat, i) => {
                  const maxCount = data.trendingCategories[0]?.count || 1;
                  const pct = Math.round((cat.count / maxCount) * 100);
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat.name}</span>
                        <span className="text-muted-foreground">{cat.count} jobs</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/70 animate-progressFill"
                          style={{
                            "--progress-width": `${pct}%`,
                            width: `${pct}%`,
                            animationDelay: `${i * 150}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </div>

          {/* ── Top Hiring Locations ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-600 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Top Hiring Locations
            </h3>
            {data?.topLocations?.length > 0 ? (
              <div className="space-y-3">
                {data.topLocations.map((loc, i) => (
                  <div
                    key={loc.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 opacity-0 animate-slideInRight"
                    style={{
                      animationFillMode: "forwards",
                      animationDelay: `${(i + 1) * 120}ms`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{loc.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {loc.count} {loc.count === 1 ? "job" : "jobs"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="opacity-0 animate-fadeSlideIn delay-500 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animationFillMode: "forwards" }}>
          {[
            { label: "Browse Jobs", path: "/Jobs", icon: Briefcase, color: "from-violet-500 to-purple-600" },
            { label: "My Profile", path: "/Profile", icon: User, color: "from-blue-500 to-cyan-500" },
            { label: "Browse Companies", path: "/Browse", icon: TrendingUp, color: "from-orange-500 to-amber-500" },
            {
              label: `${data?.totalJobsAvailable || 0} Jobs Available`,
              path: "/Jobs",
              icon: Sparkles,
              color: "from-pink-500 to-rose-500",
            },
          ].map((action, i) => (
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
