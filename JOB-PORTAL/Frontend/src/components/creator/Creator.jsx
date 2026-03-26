import React from "react";
import Navbar from "../components_lite/Navbar";
import Footer from "../components_lite/Footer";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

const Creator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] md:items-start">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[3px] shadow-lg">
                <div className="h-full w-full rounded-2xl bg-card flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">RP</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Ritik Pachouri
              </h1>
              <p className="mt-1 text-sm font-medium text-primary">
                Full Stack Developer / DevOps Trainee
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Passionate about building clean, scalable web applications
                end-to-end — from API design and authentication systems to
                polished, responsive user interfaces. Experienced with the MERN
                stack, cloud deployments, and modern DevOps practices.
              </p>

              {/* Skills */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "JWT Auth",
                    "Docker",
                    "Tailwind CSS",
                    "Git",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="mailto:ritik@example.com">
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* About the project */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
          <h2 className="text-xl font-bold mb-4">About HireSphere</h2>
          <p className="text-muted-foreground leading-relaxed">
            HireSphere is a full-stack job portal application built with the
            MERN stack. It features user authentication with JWT, role-based
            access control (Student / Recruiter), job posting and application
            management, profile editing with resume uploads, and a modern dark
            mode UI. The project demonstrates clean architecture, proper API
            design, and responsive frontend development.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "MERN Stack",
              "JWT Authentication",
              "Role-Based Access",
              "Dark Mode",
              "Responsive Design",
              "Redux Toolkit",
              "Cloudinary",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Creator;
