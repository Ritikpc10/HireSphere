import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { Badge } from "../ui/badge";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Target,
  TrendingUp,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Bookmark,
  ArrowRight,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const JobRecommendations = () => {
  const { user, token } = useSelector((store) => store.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userSkills = user?.profile?.skills || [];
  const userBio = user?.profile?.bio || "";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.success) {
          const allJobs = res.data.jobs || [];
          // Score each job based on skill match + profile match
          const scored = allJobs.map((job) => {
            let score = 0;
            const jobReqs = job.requirements || [];
            const jobTitle = (job.title || "").toLowerCase();
            const jobDesc = (job.description || "").toLowerCase();

            // Skill matching
            const matchedSkills = [];
            userSkills.forEach((skill) => {
              const s = skill.toLowerCase();
              if (jobReqs.some((r) => r.toLowerCase().includes(s)) || jobTitle.includes(s) || jobDesc.includes(s)) {
                matchedSkills.push(skill);
                score += 20;
              }
            });

            // Bio keyword matching
            const bioWords = userBio.toLowerCase().split(/\s+/);
            bioWords.forEach((word) => {
              if (word.length > 3 && (jobTitle.includes(word) || jobDesc.includes(word))) {
                score += 5;
              }
            });

            // Recency bonus
            const daysSincePosted = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSincePosted < 3) score += 15;
            else if (daysSincePosted < 7) score += 10;

            const matchPct = userSkills.length > 0
              ? Math.min(100, Math.round((matchedSkills.length / userSkills.length) * 100))
              : Math.min(100, Math.round(score));

            return { ...job, score, matchPct, matchedSkills };
          });

          // Sort by score descending
          scored.sort((a, b) => b.score - a.score);
          setJobs(scored.slice(0, 12));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token, user]);

  const getInitials = (n) => n?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl animate-shimmer bg-card border border-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Jobs For You</h1>
            <p className="text-sm text-muted-foreground">AI-powered recommendations based on your profile</p>
          </div>
        </div>

        {userSkills.length > 0 && (
          <div className="flex items-center gap-2 mb-6 opacity-0 animate-fadeSlideIn delay-100 flex-wrap" style={{ animationFillMode: "forwards" }}>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Matching based on:</span>
            {userSkills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="outline" className="text-[10px]">{skill}</Badge>
            ))}
            {userSkills.length > 6 && <span className="text-xs text-muted-foreground">+{userSkills.length - 6} more</span>}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No recommendations yet. Complete your profile to get personalized matches!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, i) => (
              <div
                key={job._id}
                className="opacity-0 animate-fadeSlideIn p-5 rounded-2xl bg-card border border-border hover-lift group cursor-pointer transition-all"
                style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
                onClick={() => navigate(`/description/${job._id}`)}
              >
                {/* Match Score */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    job.matchPct >= 70 ? "bg-green-500/10 text-green-600" :
                    job.matchPct >= 40 ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-blue-500/10 text-blue-600"
                  }`}>
                    <Target className="h-3 w-3" />
                    {job.matchPct}% match
                  </div>
                  <Bookmark className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={job.company?.logo} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                      {getInitials(job.company?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">{job.company?.name}</p>
                    <p className="font-semibold text-sm">{job.title}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.location && (
                    <Badge variant="outline" className="text-[10px] gap-1"><MapPin className="h-2.5 w-2.5" />{job.location}</Badge>
                  )}
                  {job.salary && (
                    <Badge variant="outline" className="text-[10px] gap-1"><IndianRupee className="h-2.5 w-2.5" />{job.salary} LPA</Badge>
                  )}
                  {job.jobType && (
                    <Badge variant="outline" className="text-[10px] gap-1"><Briefcase className="h-2.5 w-2.5" />{job.jobType}</Badge>
                  )}
                </div>

                {/* Matched Skills */}
                {job.matchedSkills?.length > 0 && (
                  <div className="mt-3 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary shrink-0" />
                    <span className="text-[10px] text-muted-foreground truncate">
                      Matches: {job.matchedSkills.join(", ")}
                    </span>
                  </div>
                )}

                {/* View Button */}
                <div className="flex items-center justify-end mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;
