import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { Badge } from "../ui/badge";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import {
  Send,
  Eye,
  FileSearch,
  UserCheck,
  MessageSquare,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
} from "lucide-react";

const steps = [
  { key: "applied", label: "Applied", icon: Send, color: "text-blue-500", bg: "bg-blue-500" },
  { key: "viewed", label: "Viewed", icon: Eye, color: "text-purple-500", bg: "bg-purple-500" },
  { key: "shortlisted", label: "Shortlisted", icon: FileSearch, color: "text-orange-500", bg: "bg-orange-500" },
  { key: "interview", label: "Interview", icon: MessageSquare, color: "text-cyan-500", bg: "bg-cyan-500" },
  { key: "offered", label: "Offered", icon: Award, color: "text-green-500", bg: "bg-green-500" },
];

const getStepIndex = (status) => {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s === "accepted" || s === "offered") return 4;
  if (s === "interview") return 3;
  if (s === "shortlisted") return 2;
  if (s === "viewed") return 1;
  if (s === "rejected") return -1;
  return 0; // pending/applied
};

const ApplicationTimeline = () => {
  const { token } = useSelector((store) => store.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.success) {
          setApplications(res.data.application || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl animate-shimmer bg-card border border-border mb-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Application Timeline</h1>
            <p className="text-sm text-muted-foreground">{applications.length} applications tracked</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No applications yet. Start applying to track your progress!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app, idx) => {
              const stepIdx = getStepIndex(app.status);
              const isRejected = app.status?.toLowerCase() === "rejected";
              return (
                <div
                  key={app._id}
                  className="opacity-0 animate-fadeSlideIn p-6 rounded-2xl bg-card border border-border hover-lift"
                  style={{ animationFillMode: "forwards", animationDelay: `${idx * 100}ms` }}
                >
                  {/* Job Info */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-semibold text-lg">{app.job?.title || "Job"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.job?.company?.name || "Company"} • Applied{" "}
                        {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    {isRejected ? (
                      <Badge className="bg-red-500/10 text-red-600 border-red-200 gap-1">
                        <XCircle className="h-3 w-3" /> Rejected
                      </Badge>
                    ) : stepIdx === 4 ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-200 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Offered
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200 gap-1">
                        <Clock className="h-3 w-3" /> In Progress
                      </Badge>
                    )}
                  </div>

                  {/* Timeline Steps */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 mt-4">
                    {steps.map((step, i) => {
                      const isCompleted = !isRejected && i <= stepIdx;
                      const isCurrent = !isRejected && i === stepIdx;
                      return (
                        <React.Fragment key={step.key}>
                          <div className="flex md:flex-col items-center gap-3 md:gap-0 relative group">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${
                                isRejected
                                  ? "bg-muted text-muted-foreground"
                                  : isCompleted
                                  ? `${step.bg} text-white shadow-lg`
                                  : "bg-muted text-muted-foreground"
                              } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                              style={{ animationDelay: `${(idx * 5 + i) * 100}ms` }}
                            >
                              <step.icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col md:items-center">
                              <span className={`text-[10px] md:mt-1.5 font-bold uppercase tracking-tight ${isCompleted && !isRejected ? step.color : "text-muted-foreground"}`}>
                                {step.label}
                              </span>
                              <span className="text-[9px] text-muted-foreground md:hidden">
                                {isCompleted ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </div>
                          {i < steps.length - 1 && (
                            <div className="hidden md:block flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-muted">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  !isRejected && i < stepIdx ? "bg-gradient-to-r from-primary to-secondary w-full" : "w-0"
                                }`}
                                style={{ transitionDelay: `${i * 200}ms` }}
                              />
                            </div>
                          )}
                          {i < steps.length - 1 && (
                            <div className="md:hidden ml-5 w-0.5 h-6 bg-muted relative">
                               <div
                                className={`absolute top-0 left-0 w-full rounded-full transition-all duration-700 ${
                                  !isRejected && i < stepIdx ? "bg-primary h-full" : "h-0"
                                }`}
                                style={{ transitionDelay: `${i * 200}ms` }}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
