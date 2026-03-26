import React, { useState } from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Video,
  Play,
  Briefcase,
  MapPin,
  IndianRupee,
  Building2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// Demo data for video job posts
const videoJobs = [
  {
    id: 1,
    company: "Google",
    recruiter: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    location: "Bangalore",
    salary: "35-45 LPA",
    thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // generic demo video
    tags: ["React", "TypeScript", "Performance"],
    views: "12.5k",
  },
  {
    id: 2,
    company: "Microsoft",
    recruiter: "David Chen",
    role: "Cloud Architect",
    location: "Hyderabad",
    salary: "40-50 LPA",
    thumbnail: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["Azure", "Kubernetes", "System Design"],
    views: "8.2k",
  },
  {
    id: 3,
    company: "Amazon",
    recruiter: "Priya Kumar",
    role: "SDE II",
    location: "Remote",
    salary: "30-40 LPA",
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["Java", "AWS", "Microservices"],
    views: "15.1k",
  },
];

const RecruiterVideoPosts = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Video Job Posts</h1>
            <p className="text-sm text-muted-foreground">Hear directly from hiring managers about the role and culture</p>
          </div>
        </div>

        {/* Hero Feature */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 mb-8 opacity-0 animate-fadeSlideIn delay-100" style={{ animationFillMode: "forwards" }}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <Badge className="bg-primary text-white mb-3">New Feature</Badge>
              <h2 className="text-xl font-bold mb-2">Why apply through Video Posts?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Meet your future manager before applying</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Get a real feel for company culture</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Understand the actual day-to-day responsibilities</li>
              </ul>
              <Button className="bg-primary">Browse All Video Posts</Button>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                <img src={videoJobs[0].thumbnail} alt="Hero thumbnail" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all cursor-pointer">
                    <Play className="h-6 w-6 text-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoJobs.map((job, i) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover-lift opacity-0 animate-fadeSlideIn"
              style={{ animationFillMode: "forwards", animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="aspect-[9/16] bg-black relative group cursor-pointer" onClick={() => setActiveVideo(job)}>
                <img src={job.thumbnail} alt={job.role} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1" />
                  </div>
                </div>

                {/* Top gradient text */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-white/20">
                      <AvatarFallback className="text-[10px] bg-primary text-white">{job.company[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <p className="font-semibold text-sm leading-tight">{job.recruiter}</p>
                      <p className="text-[10px] text-white/70">{job.company} • Hiring Manager</p>
                    </div>
                  </div>
                </div>

                {/* Bottom gradient text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12">
                  <Badge variant="outline" className="text-[10px] text-white border-white/30 bg-black/30 mb-2 backdrop-blur-sm">
                    👁 {job.views} views
                  </Badge>
                  <h3 className="text-lg font-bold text-white leading-tight">{job.role}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-white/80">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="flex items-center gap-0.5"><IndianRupee className="h-3 w-3" /> {job.salary}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex gap-2">
                <Button className="w-full bg-primary">Apply Now</Button>
                <Button variant="outline" className="w-12 shrink-0 p-0"><ChevronRight className="h-5 w-5" /></Button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                ✕
              </button>
              
              <div className="md:w-2/3 bg-black">
                <video 
                  src={activeVideo.videoUrl} 
                  autoPlay 
                  controls 
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              </div>
              
              <div className="md:w-1/3 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{activeVideo.company[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-lg">{activeVideo.role}</h2>
                    <p className="text-sm text-muted-foreground">{activeVideo.company} • {activeVideo.location}</p>
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <IndianRupee className="h-4 w-4 text-primary" /> Salary
                    </p>
                    <p className="text-sm text-muted-foreground">{activeVideo.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-primary" /> Requirements
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activeVideo.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">About this role</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "Hi! I'm {activeVideo.recruiter}, the hiring manager for this role. I'm looking for a passionate engineer to join our core team. Watch the video to see our office and what you'll be building! Apply below if it sounds like a match."
                    </p>
                  </div>
                </div>
                
                <Button className="w-full bg-primary mt-6 hover:scale-105 transition-transform">
                  Apply for this Role
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterVideoPosts;
