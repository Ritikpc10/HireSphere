import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card my-5 p-6 md:p-8 shadow-sm mx-4 sm:mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-2 ring-primary/20">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt={user?.fullname}
              />
              <AvatarFallback>
                {user?.fullname
                  ? user.fullname
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xl">{user?.fullname}</h1>
              <p className="text-muted-foreground">{user?.profile?.bio}</p>
            </div>
          </div>
          <div className="flex gap-2 self-start">
            <Button
              onClick={() => toast.info("Select a section to add: Experience, Education, or Projects (Coming Soon)")}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add Section
            </Button>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              size="icon"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="my-5 space-y-2">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${user?.email}`}
              className="text-sm hover:text-primary transition-colors"
            >
              {user?.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Contact className="h-4 w-4 text-muted-foreground" />
            <a
              href={`tel:${user?.phoneNumber}`}
              className="text-sm hover:text-primary transition-colors"
            >
              {user?.phoneNumber}
            </a>
          </div>
        </div>

        <div className="my-5">
          <h2 className="font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No skills added yet
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Resume</h2>
          {user?.profile?.resume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.profile.resume}
              className="text-primary hover:underline text-sm"
            >
              {user.profile.resumeOriginalName || "Download Resume"}
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">
              No resume uploaded
            </span>
          )}
        </div>
      </div>

      {user?.role === "student" && (
        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 mb-8 mx-4 sm:mx-auto">
          <h1 className="text-lg font-bold mb-4">Applied Jobs</h1>
          <AppliedJob />
        </div>
      )}

      {user?.role === "Recruiter" && (
        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 mb-8 mx-4 sm:mx-auto text-center">
          <h1 className="text-lg font-bold mb-4">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mb-6">Manage your job postings and company profile from the admin portal.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/admin/jobs")} className="bg-primary">
              Manage Jobs
            </Button>
            <Button onClick={() => navigate("/admin/companies")} variant="outline">
              Company Settings
            </Button>
          </div>
        </div>
      )}

      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
