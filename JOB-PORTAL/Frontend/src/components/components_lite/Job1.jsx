import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Bookmark, BookmarkCheck, MapPin, Banknote, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const { user, token } = useSelector((store) => store.auth);
  const [isSaved, setIsSaved] = useState(
    user?.savedJobs?.includes(job?._id) || false
  );
  const [saving, setSaving] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save jobs");
      return navigate("/login");
    }
    setSaving(true);
    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/save-job/${job._id}`,
        {},
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (res.data.success) {
        setIsSaved(res.data.saved);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  // Calculate match score based on user skills vs job requirements
  const getMatchScore = () => {
    if (!user?.profile?.skills?.length || !job?.requirements?.length) return null;
    const userSkills = user.profile.skills.map((s) => s.toLowerCase());
    const requirements = (Array.isArray(job.requirements)
      ? job.requirements
      : String(job.requirements).split(",")
    ).map((r) => r.trim().toLowerCase());
    const matches = requirements.filter((req) =>
      userSkills.some((skill) => req.includes(skill) || skill.includes(req))
    );
    return Math.round((matches.length / requirements.length) * 100);
  };

  const matchScore = getMatchScore();

  return (
    <div className="p-5 rounded-2xl bg-card border border-border hover-lift transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)}d ago`}
        </p>
        <div className="flex items-center gap-2">
          {matchScore !== null && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                matchScore >= 70
                  ? "bg-green-500/10 text-green-600"
                  : matchScore >= 40
                  ? "bg-yellow-500/10 text-yellow-600"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {matchScore}% Match
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
            title={isSaved ? "Remove from saved" : "Save for later"}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 my-3">
        <Avatar className="h-11 w-11 rounded-xl border border-border">
          <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
            {getInitials(job?.company?.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{job?.company?.name}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job?.company?.location || job?.location || "India"}
          </p>
        </div>
      </div>

      <h1 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
        {job?.title}
      </h1>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {job?.description}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <Badge className="text-xs" variant="outline">
          {job?.position} Positions
        </Badge>
        <Badge className="text-xs" variant="outline">
          <Banknote className="h-3 w-3 mr-0.5" />
          {job?.salary} LPA
        </Badge>
        <Badge className="text-xs" variant="outline">
          <Clock className="h-3 w-3 mr-0.5" />
          {job?.jobType}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg"
        >
          Details
        </Button>
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          size="sm"
          className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default Job1;
