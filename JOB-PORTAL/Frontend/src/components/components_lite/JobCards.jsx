import React from "react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-xl bg-card border border-border cursor-pointer shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-slideFadeInUp"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 rounded-lg border border-border">
          <AvatarImage
            src={job?.company?.logo}
            alt={job?.company?.name}
          />
          <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
            {getInitials(job?.company?.name || job?.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-medium">
            {job?.company?.name || job.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {job?.location || "India"}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <h2 className="font-bold text-lg">{job.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 items-center mt-4">
        <Badge className="text-primary font-bold" variant="ghost">
          {job.position} Positions
        </Badge>
        <Badge className="text-secondary font-bold" variant="ghost">
          {job.salary} LPA
        </Badge>
        <Badge className="text-primary font-bold" variant="ghost">
          {job.location}
        </Badge>
        <Badge className="text-foreground font-bold" variant="ghost">
          {job.jobType}
        </Badge>
      </div>
    </div>
  );
};

export default JobCards;
