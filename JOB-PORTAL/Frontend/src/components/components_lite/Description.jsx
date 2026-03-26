import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MapPin,
  Banknote,
  Clock,
  Briefcase,
  Users,
  Calendar,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Star,
} from "lucide-react";

const Description = () => {
  const params = useParams();
  const jobId = params.id;
  const navigate = useNavigate();

  const { singleJob } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useSelector((store) => store.auth);

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchSingleJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        } else {
          setError("Failed to fetch job details.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id, token]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="h-8 w-48 rounded-lg animate-shimmer bg-muted mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-14 w-3/4 rounded-lg animate-shimmer bg-muted" />
              <div className="h-4 w-1/2 rounded animate-shimmer bg-muted" />
              <div className="h-32 rounded-2xl animate-shimmer bg-card border border-border" />
            </div>
            <div className="h-64 rounded-2xl animate-shimmer bg-card border border-border" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-xl text-destructive">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!singleJob) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="opacity-0 animate-fadeSlideIn p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 rounded-xl border border-border">
                    <AvatarImage
                      src={singleJob?.company?.logo}
                      alt={singleJob?.company?.name}
                    />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                      {getInitials(singleJob?.company?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{singleJob?.title}</h1>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="h-4 w-4" />
                      {singleJob?.company?.name}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={isApplied ? null : applyJobHandler}
                  disabled={isApplied}
                  size="lg"
                  className={`shrink-0 rounded-xl ${
                    isApplied
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Already Applied
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="text-primary" variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {singleJob?.position} Positions
                </Badge>
                <Badge className="text-secondary" variant="outline">
                  <Banknote className="h-3 w-3 mr-1" />
                  {singleJob?.salary} LPA
                </Badge>
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {singleJob?.location}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {singleJob?.jobType}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fadeSlideIn delay-200 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-lg mb-3">Job Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {singleJob?.description}
              </p>
            </div>

            {/* Requirements */}
            {singleJob?.requirements?.length > 0 && (
              <div className="opacity-0 animate-fadeSlideIn delay-300 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
                <h2 className="font-semibold text-lg mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {(Array.isArray(singleJob.requirements)
                    ? singleJob.requirements
                    : String(singleJob.requirements).split(",")
                  ).map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{String(req).trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Job Details Card */}
            <div className="opacity-0 animate-fadeSlideIn delay-200 p-6 rounded-2xl bg-card border border-border sticky top-24" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold text-lg mb-4">Job Details</h3>
              <div className="space-y-4">
                {[
                  { icon: Briefcase, label: "Role", value: `${singleJob?.position} Open Positions` },
                  { icon: MapPin, label: "Location", value: singleJob?.location },
                  { icon: Banknote, label: "Salary", value: `${singleJob?.salary} LPA` },
                  { icon: Clock, label: "Experience", value: `${singleJob?.experienceLevel} Year(s)` },
                  { icon: Users, label: "Applicants", value: singleJob?.applications?.length },
                  { icon: Calendar, label: "Posted", value: singleJob?.createdAt?.split("T")[0] },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Card */}
            <div className="opacity-0 animate-fadeSlideIn delay-300 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold text-lg mb-3">About Company</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-xl border border-border">
                  <AvatarImage src={singleJob?.company?.logo} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {getInitials(singleJob?.company?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{singleJob?.company?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {singleJob?.company?.location || singleJob?.location}
                  </p>
                </div>
              </div>
              {singleJob?.company?.description && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {singleJob.company.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
