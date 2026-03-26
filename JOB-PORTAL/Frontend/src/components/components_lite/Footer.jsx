import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold tracking-tight mb-3">
              <span className="text-primary">Hire</span>{" "}
              <span className="text-secondary">Sphere</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Your gateway to career opportunities. Discover, apply, and land
              your dream job with confidence.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "mailto:contact@hiresphere.com", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                >
                  <social.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold text-sm mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { to: "/jobs", label: "Browse Jobs" },
                { to: "/browse", label: "Browse Companies" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/profile", label: "My Profile" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { to: "/Creator", label: "About Us" },
                { to: "/PrivacyPolicy", label: "Privacy Policy" },
                { to: "/TermsofService", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get notified about new job opportunities
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-muted/60 border border-border text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              />
              <button 
                onClick={() => toast.success("Feature coming soon: You've been added to our newsletter!")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {currentYear} HireSphere. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by{" "}
            <Link
              to="/Creator"
              className="font-medium text-primary hover:underline"
            >
              Ritik Pachouri
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
