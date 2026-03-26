import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search, Sparkles, Briefcase, Building2, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

// ── Animated Counter ──
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!end) return;
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 30)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchjobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchjobHandler();
  };

  const jobCount = useCounter(500);
  const companyCount = useCounter(120);
  const userCount = useCounter(10000);

  return (
    <div className="relative overflow-hidden">
      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradientShift" />

      {/* ── Floating decorative shapes ── */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-floatBob blur-xl" />
      <div className="absolute top-32 right-20 w-32 h-32 rounded-full bg-secondary/20 animate-floatBob blur-xl" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-10 left-1/4 w-24 h-24 rounded-full bg-primary/15 animate-floatBob blur-xl" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 py-20 md:py-28 px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* ── Badge ── */}
          <div className="opacity-0 animate-fadeSlideIn mb-6" style={{ animationFillMode: "forwards" }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
              <Sparkles className="h-4 w-4" />
              India's #1 Job Search Platform
            </span>
          </div>

          {/* ── Headline ── */}
          <h1 className="opacity-0 animate-fadeSlideIn delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight" style={{ animationFillMode: "forwards" }}>
            Find Your{" "}
            <span className="relative">
              <span className="text-dual-gradient animate-gradientShift">
                Dream Career
              </span>
            </span>
            <br />
            <span className="text-foreground/80 text-3xl sm:text-4xl md:text-5xl">
              That You Deserve
            </span>
          </h1>

          {/* ── Subtitle ── */}
          <p className="opacity-0 animate-fadeSlideIn delay-200 mt-6 text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ animationFillMode: "forwards" }}>
            Explore thousands of curated opportunities from top companies.
            Your next career breakthrough is just one search away.
          </p>

          {/* ── Search Bar ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-300 mt-10" style={{ animationFillMode: "forwards" }}>
            <div className="flex w-full max-w-2xl shadow-xl shadow-primary/5 border border-border bg-card/80 backdrop-blur-sm pl-5 rounded-full items-center gap-3 mx-auto pr-1.5 py-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, company, or keyword..."
                className="outline-none border-none w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm sm:text-base py-2"
              />
              <Button
                onClick={searchjobHandler}
                className="rounded-full px-6 bg-dual-gradient hover:opacity-90 transition-opacity shrink-0 text-white"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Frontend Developer", "Data Scientist", "DevOps", "UI/UX Designer"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    dispatch(setSearchedQuery(tag));
                    navigate("/browse");
                  }}
                  className="px-3 py-1 rounded-full text-xs text-muted-foreground bg-muted/60 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="opacity-0 animate-fadeSlideIn delay-500 mt-14 grid grid-cols-3 max-w-lg mx-auto gap-4" style={{ animationFillMode: "forwards" }}>
            {[
              { icon: Briefcase, count: jobCount, suffix: "+", label: "Active Jobs" },
              { icon: Building2, count: companyCount, suffix: "+", label: "Companies" },
              { icon: Users, count: userCount, suffix: "+", label: "Job Seekers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold stat-number text-foreground">
                  {stat.count.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
