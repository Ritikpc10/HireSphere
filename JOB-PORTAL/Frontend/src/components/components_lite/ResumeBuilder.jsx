import React, { useState, useRef } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Eye,
  Palette,
  GripVertical,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  X,
} from "lucide-react";

const templates = [
  { id: "modern", name: "Modern", accent: "#7c3aed", font: "'Inter', sans-serif" },
  { id: "classic", name: "Classic", accent: "#1e40af", font: "'Georgia', serif" },
  { id: "creative", name: "Creative", accent: "#ea580c", font: "'Outfit', sans-serif" },
  { id: "minimal", name: "Minimal", accent: "#18181b", font: "'Inter', sans-serif" },
];

const defaultResume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "" }],
  skills: [""],
  certifications: [""],
};

const ResumeBuilder = () => {
  const { user } = useSelector((store) => store.auth);
  const [resume, setResume] = useState({
    ...defaultResume,
    name: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });
  const [template, setTemplate] = useState(templates[0]);
  const [preview, setPreview] = useState(false);
  const printRef = useRef();

  const update = (field, value) => setResume((prev) => ({ ...prev, [field]: value }));

  const updateArray = (field, index, key, value) => {
    setResume((prev) => {
      const arr = [...prev[field]];
      if (typeof arr[index] === "string") arr[index] = value;
      else arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addItem = (field, template) => {
    setResume((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeItem = (field, index) => {
    setResume((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>${resume.name || "Resume"}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${template.font}; color: #1a1a1a; }
        @media print { body { -webkit-print-color-adjust: exact; } }
      </style>
      </head><body>${content.innerHTML}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Resume Builder</h1>
              <p className="text-sm text-muted-foreground transition-all">Build professional resume in minutes</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={() => setPreview(!preview)} className="flex-1 md:flex-none">
              <Eye className="h-4 w-4 mr-2" /> {preview ? "Back to Edit" : "Live Preview"}
            </Button>
            <Button onClick={handlePrint} className="bg-gradient-to-r from-primary to-secondary text-white flex-1 md:flex-none">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
        </div>

        {/* Template Picker */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shrink-0 ${
                template.id === t.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"
              }`}
            >
              <Palette className="h-4 w-4" style={{ color: t.accent }} />
              <span className="text-sm font-medium">{t.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Editor Panel */}
          <div className={`space-y-5 ${preview ? "hidden lg:block" : "block"}`}>
            {/* Personal Info */}
            <div className="p-5 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Full Name" value={resume.name} onChange={(e) => update("name", e.target.value)} className="sm:col-span-2" />
                <Input placeholder="Job Title" value={resume.title} onChange={(e) => update("title", e.target.value)} className="sm:col-span-2" />
                <Input placeholder="Email" value={resume.email} onChange={(e) => update("email", e.target.value)} />
                <Input placeholder="Phone" value={resume.phone} onChange={(e) => update("phone", e.target.value)} />
                <Input placeholder="Location" value={resume.location} onChange={(e) => update("location", e.target.value)} />
                <Input placeholder="Website" value={resume.website} onChange={(e) => update("website", e.target.value)} />
              </div>
            </div>

            {/* Summary */}
            <div className="p-5 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-100" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-3">Professional Summary</h3>
              <textarea
                rows={3}
                placeholder="Brief overview..."
                value={resume.summary}
                onChange={(e) => update("summary", e.target.value)}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none"
              />
            </div>

            {/* Experience */}
            <div className="p-5 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-200" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Experience</h3>
                <Button variant="ghost" size="sm" onClick={() => addItem("experience", { company: "", role: "", duration: "", description: "" })}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb-3 p-3 rounded-xl bg-muted/30 relative group">
                  <button onClick={() => removeItem("experience", i)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                    <X className="h-3 w-3" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input placeholder="Company" value={exp.company} onChange={(e) => updateArray("experience", i, "company", e.target.value)} />
                    <Input placeholder="Role" value={exp.role} onChange={(e) => updateArray("experience", i, "role", e.target.value)} />
                    <Input placeholder="Duration" value={exp.duration} onChange={(e) => updateArray("experience", i, "duration", e.target.value)} className="sm:col-span-2" />
                    <textarea rows={2} placeholder="Achievements..." value={exp.description} onChange={(e) => updateArray("experience", i, "description", e.target.value)} className="sm:col-span-2 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none" />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="p-5 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-400" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2"><Code className="h-4 w-4 text-primary" /> Skills</h3>
                <Button variant="ghost" size="sm" onClick={() => addItem("skills", "")}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-1 bg-muted/30 rounded-lg px-2 py-1">
                    <input
                      value={skill}
                      onChange={(e) => updateArray("skills", i, null, e.target.value)}
                      placeholder="Skill"
                      className="bg-transparent text-sm w-20 sm:w-24 outline-none"
                    />
                    <button onClick={() => removeItem("skills", i)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className={`${!preview ? "hidden lg:block" : "block"}`}>
            <div className="lg:sticky lg:top-24">
              <div ref={printRef} className="bg-white text-black rounded-2xl border shadow-xl overflow-hidden min-h-[600px]" style={{ fontFamily: template.font }}>
                {/* Template Logic */}
                {template.id === "creative" ? (
                  <div className="flex h-full min-h-[842px]">
                    {/* Sidebar */}
                    <div className="w-1/3 text-white p-6 sm:p-8" style={{ backgroundColor: template.accent }}>
                      <div className="mb-8">
                        <h1 className="text-xl font-bold leading-tight">{resume.name || "Your Name"}</h1>
                        <p className="text-sm opacity-80 mt-1">{resume.title || "Job Title"}</p>
                      </div>
                      
                      <div className="space-y-4 text-[10px]">
                        <h3 className="font-bold border-b border-white/20 pb-1">Contact</h3>
                        {resume.email && <p className="flex items-center gap-2">✉ {resume.email}</p>}
                        {resume.phone && <p className="flex items-center gap-2">📞 {resume.phone}</p>}
                        {resume.location && <p className="flex items-center gap-2">📍 {resume.location}</p>}
                        {resume.website && <p className="flex items-center gap-2">🌐 {resume.website}</p>}
                      </div>

                      <div className="mt-8 space-y-4">
                        <h3 className="font-bold border-b border-white/20 pb-1 text-[10px]">Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {resume.skills.filter(s=>s).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-[9px]">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Main */}
                    <div className="flex-1 p-6 sm:p-8 space-y-6 bg-white">
                      {resume.summary && (
                        <section>
                          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: template.accent }}>Profile</h2>
                          <p className="text-xs text-gray-600 leading-relaxed">{resume.summary}</p>
                        </section>
                      )}
                      
                      <section>
                        <h2 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: template.accent }}>Experience</h2>
                        <div className="space-y-4">
                          {resume.experience.filter(e => e.company).map((exp, i) => (
                            <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: `${template.accent}20` }}>
                              <p className="font-bold text-sm text-gray-800">{exp.role}</p>
                              <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-1">
                                <span>{exp.company}</span>
                                <span>{exp.duration}</span>
                              </div>
                              <p className="text-[11px] text-gray-600 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                ) : template.id === "classic" ? (
                  <div className="p-10 space-y-6 bg-white">
                    <div className="text-center space-y-2 border-b-2 pb-6" style={{ borderColor: template.accent }}>
                      <h1 className="text-3xl font-serif font-bold uppercase tracking-wider">{resume.name || "Your Name"}</h1>
                      <div className="flex justify-center gap-4 text-[11px] text-gray-600">
                        {resume.email && <span>{resume.email}</span>}
                        {resume.phone && <span>{resume.phone}</span>}
                        {resume.location && <span>{resume.location}</span>}
                        {resume.website && <span>{resume.website}</span>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {resume.summary && (
                        <section>
                          <h2 className="text-sm font-bold uppercase mb-2 text-center" style={{ color: template.accent }}>Professional Summary</h2>
                          <p className="text-xs text-gray-600 leading-relaxed text-center italic">{resume.summary}</p>
                        </section>
                      )}
                      
                      <section>
                        <h2 className="text-sm font-bold border-b border-gray-100 mb-3" style={{ color: template.accent }}>Experience</h2>
                        <div className="space-y-4">
                          {resume.experience.filter(e => e.company).map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline">
                                <p className="font-bold text-sm">{exp.role}</p>
                                <span className="text-[10px] font-bold text-gray-400">{exp.duration}</span>
                              </div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">{exp.company}</p>
                              <p className="text-[11px] text-gray-600 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-sm font-bold border-b border-gray-100 mb-3" style={{ color: template.accent }}>Skills & Expertise</h2>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {resume.skills.filter(s=>s).join(" • ")}
                        </p>
                      </section>
                    </div>
                  </div>
                ) : template.id === "minimal" ? (
                  <div className="p-8 space-y-8 bg-white max-w-[800px] mx-auto">
                    <div className="flex justify-between items-end border-b pb-6">
                      <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">{resume.name || "NAME"}</h1>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{resume.title || "TITLE"}</p>
                      </div>
                      <div className="text-[9px] text-right space-y-0.5 text-gray-500 font-medium">
                        {resume.email && <div>{resume.email}</div>}
                        {resume.phone && <div>{resume.phone}</div>}
                        {resume.location && <div>{resume.location}</div>}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {resume.summary && (
                        <div className="flex gap-8">
                          <div className="w-24 shrink-0 text-[10px] font-bold text-gray-300 uppercase vertical-text">Profile</div>
                          <p className="text-[11px] text-gray-500 leading-loose">{resume.summary}</p>
                        </div>
                      )}

                      <div className="flex gap-8">
                        <div className="w-24 shrink-0 text-[10px] font-bold text-gray-300 uppercase vertical-text">Experience</div>
                        <div className="flex-1 space-y-6">
                          {resume.experience.filter(e => e.company).map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-[11px] font-bold text-gray-800">{exp.role}</span>
                                <span className="text-[9px] font-bold text-gray-300 tracking-tighter">{exp.duration}</span>
                              </div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">{exp.company}</div>
                              <p className="text-[11px] text-gray-500 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-8">
                        <div className="w-24 shrink-0 text-[10px] font-bold text-gray-300 uppercase vertical-text">Stack</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {resume.skills.filter(s=>s).map((s, i) => (
                            <span key={i} className="text-[10px] font-bold text-gray-800">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // MODERN (Default)
                  <>
                    <div className="px-6 sm:px-8 py-6" style={{ background: `linear-gradient(135deg, ${template.accent}, ${template.accent}dd)` }}>
                      <h1 className="text-2xl font-bold text-white">{resume.name || "Your Name"}</h1>
                      <p className="text-white/80 mt-1">{resume.title || "Job Title"}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-[10px] text-white/70">
                        {resume.email && <span className="flex items-center gap-1">✉ {resume.email}</span>}
                        {resume.phone && <span className="flex items-center gap-1">📞 {resume.phone}</span>}
                        {resume.location && <span className="flex items-center gap-1">📍 {resume.location}</span>}
                        {resume.website && <span className="flex items-center gap-1">🌐 {resume.website}</span>}
                      </div>
                    </div>

                    <div className="px-6 sm:px-8 py-6 space-y-6">
                      {resume.summary && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accent }}>Summary</h2>
                          <div className="h-px w-full bg-gray-100 mb-2" />
                          <p className="text-xs text-gray-600 leading-relaxed text-justify">{resume.summary}</p>
                        </div>
                      )}

                      {resume.experience.some((e) => e.company) && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accent }}>Work Experience</h2>
                          <div className="h-px w-full bg-gray-100 mb-2" />
                          {resume.experience.filter((e) => e.company).map((exp, i) => (
                            <div key={i} className="mb-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-bold text-sm text-gray-800">{exp.role}</p>
                                  <p className="text-xs font-semibold text-gray-500">{exp.company}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium italic">{exp.duration}</span>
                              </div>
                              {exp.description && <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}

                      {resume.skills.some((s) => s) && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accent }}>Core Skills</h2>
                          <div className="h-px w-full bg-gray-100 mb-2" />
                          <div className="flex flex-wrap gap-2 pt-1">
                            {resume.skills.filter((s) => s).map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 text-[10px] font-semibold border rounded" style={{ borderColor: `${template.accent}40`, color: template.accent }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
