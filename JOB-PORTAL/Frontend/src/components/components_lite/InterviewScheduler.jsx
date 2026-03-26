import React, { useState } from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";

const demoInterviews = [
  {
    id: 1,
    company: "TechCorp India",
    role: "Senior Frontend Developer",
    date: "2026-03-28",
    time: "11:00 AM",
    type: "Video Call",
    platform: "Google Meet",
    status: "upcoming",
    notes: "Round 2 - Technical Interview",
  },
  {
    id: 2,
    company: "InfoSys",
    role: "Full Stack Developer",
    date: "2026-03-30",
    time: "2:00 PM",
    type: "In-person",
    location: "Bangalore Office",
    status: "upcoming",
    notes: "HR Round",
  },
  {
    id: 3,
    company: "Wipro",
    role: "MERN Developer",
    date: "2026-03-25",
    time: "10:00 AM",
    type: "Video Call",
    platform: "Zoom",
    status: "completed",
    notes: "Screening Round - Completed",
  },
];

const InterviewScheduler = () => {
  const [interviews, setInterviews] = useState(demoInterviews);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({
    company: "",
    role: "",
    date: "",
    time: "",
    type: "Video Call",
    platform: "",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newInterview = {
      ...form,
      id: Date.now(),
      status: "upcoming",
    };
    setInterviews((prev) => [...prev, newInterview]);
    setShowForm(false);
    setForm({ company: "", role: "", date: "", time: "", type: "Video Call", platform: "", notes: "" });
  };

  const handleDelete = (id) => {
    setInterviews((prev) => prev.filter((i) => i.id !== id));
  };

  // Calendar helpers
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const daysWithInterviews = interviews
    .filter((i) => i.status === "upcoming")
    .map((i) => new Date(i.date).getDate());

  const today = new Date();
  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Interview Scheduler</h1>
              <p className="text-sm text-muted-foreground">
                {interviews.filter((i) => i.status === "upcoming").length} upcoming interviews
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="opacity-0 animate-fadeSlideIn delay-100 p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 rounded hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="font-semibold text-sm">{monthName}</h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 rounded hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d} className="text-[10px] font-medium text-muted-foreground py-1">{d}</span>
              ))}
              {Array.from({ length: getFirstDay(currentMonth) }, (_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                const day = i + 1;
                const isToday = isCurrentMonth && day === today.getDate();
                const hasInterview = daysWithInterviews.includes(day);
                return (
                  <button
                    key={day}
                    className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors mx-auto flex items-center justify-center relative ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : hasInterview
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-muted"
                    }`}
                  >
                    {day}
                    {hasInterview && !isToday && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interview List */}
          <div className="lg:col-span-2 space-y-4">
            {showForm && (
              <div className="opacity-0 animate-scaleIn p-6 rounded-2xl bg-card border border-border" style={{ animationFillMode: "forwards" }}>
                <h3 className="font-semibold mb-4">Schedule New Interview</h3>
                <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                  <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="In-person">In-person</option>
                    <option value="Phone">Phone</option>
                  </select>
                  <Input placeholder="Platform/Location" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
                  <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="sm:col-span-2" />
                  <div className="sm:col-span-2 flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary">Schedule</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Upcoming */}
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Upcoming</h3>
            {interviews.filter((i) => i.status === "upcoming").length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-card border border-border">
                <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              </div>
            ) : (
              interviews
                .filter((i) => i.status === "upcoming")
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((interview, i) => (
                  <div
                    key={interview.id}
                    className="opacity-0 animate-fadeSlideIn p-5 rounded-2xl bg-card border border-border hover-lift group"
                    style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{interview.role}</h4>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(interview.id)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Badge variant="outline" className="text-xs gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(interview.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <Clock className="h-3 w-3" /> {interview.time}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        {interview.type === "Video Call" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {interview.platform || interview.location || interview.type}
                      </Badge>
                    </div>
                    {interview.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">📝 {interview.notes}</p>
                    )}
                  </div>
                ))
            )}

            {/* Completed */}
            {interviews.filter((i) => i.status === "completed").length > 0 && (
              <>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-6">Completed</h3>
                {interviews.filter((i) => i.status === "completed").map((interview, i) => (
                  <div
                    key={interview.id}
                    className="opacity-0 animate-fadeSlideIn p-4 rounded-2xl bg-card border border-border opacity-70"
                    style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{interview.role}</h4>
                        <p className="text-xs text-muted-foreground">{interview.company}</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </Badge>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
