import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "@/utils/data";
import Navbar from "./Navbar";
import { Bookmark, MapPin, Banknote, Clock, Briefcase, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_ENDPOINT}/saved-jobs`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [token]);

  const handleUnsave = async (jobId) => {
    try {
      await axios.post(`${USER_API_ENDPOINT}/save-job/${jobId}`, {}, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Saved Jobs</h1>
            <p className="text-sm text-muted-foreground">
              {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl animate-shimmer bg-card border border-border" />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No saved jobs</h2>
            <p className="text-muted-foreground mb-4">
              Browse jobs and save the ones you're interested in
            </p>
            <Button onClick={() => navigate("/Jobs")} className="bg-gradient-to-r from-primary to-secondary text-white">
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job, i) => (
              <div
                key={job._id}
                className="opacity-0 animate-fadeSlideIn p-5 rounded-2xl bg-card border border-border hover-lift cursor-pointer group"
                style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1" onClick={() => navigate(`/description/${job._id}`)}>
                    <Avatar className="h-12 w-12 rounded-xl border border-border shrink-0">
                      <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                      <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
                        {getInitials(job.company?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company?.name}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />{job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Banknote className="h-3 w-3 mr-1" />{job.salary} LPA
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />{job.jobType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />{job.experienceLevel}yr exp
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsave(job._id);
                    }}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
