import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User2, Sun, Moon, Monitor, Menu, X, Bookmark, ChevronDown, Sparkles, FileText, IndianRupee, Star, Brain, Gift, Video, Briefcase, LayoutDashboard } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { clearAuth } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, token } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/logout`,
        {},
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (res?.data?.success) {
        dispatch(clearAuth());
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const ThemeIcon = theme === "light" ? Moon : theme === "dark" ? Sun : Monitor;
  const themeLabel =
    theme === "light" ? "Dark" : theme === "dark" ? "System" : "Light";

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `hover:text-primary transition-colors ${
      isActive(path) ? "text-primary font-semibold" : ""
    }`;

  const studentLinks = [
    { to: "/Home", label: "Home", icon: Briefcase },
    { to: "/Jobs", label: "Browse Jobs", icon: Briefcase },
    { to: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
  ];

  const discoveryLinks = [
    { to: "/jobs-for-you", label: "AI Recommendations", icon: Sparkles },
    { to: "/company-reviews", label: "Company Reviews", icon: Star },
    { to: "/refer-and-earn", label: "Refer & Earn", icon: Gift },
    { to: "/timeline", label: "Application Timeline", icon: ChevronDown },
  ];

  const toolLinks = [
    { to: "/resume-builder", label: "Resume Builder", icon: FileText },
    { to: "/skill-assessment", label: "Skill Tests", icon: Brain },
    { to: "/video-intro", label: "Video Intro", icon: Video },
    { to: "/salary-insights", label: "Salary Insights", icon: IndianRupee },
  ];

  const recruiterLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/jobs", label: "Manage Jobs", icon: Briefcase },
    { to: "/video-jobs", label: "Video Job Posts", icon: Video },
    { to: "/company-reviews", label: "Community Reviews", icon: Star },
    { to: "/admin/panel", label: "Super Admin", icon: User2 },
  ];

  const links = user?.role === "Recruiter" ? recruiterLinks : studentLinks;

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-dual-gradient">
            HireSphere
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex font-medium items-center gap-6 text-foreground/80">
            {studentLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={navLinkClass(link.to)}>
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Discover Dropdown */}
            <li>
              <Popover>
                <PopoverTrigger className="flex items-center gap-1 hover:text-primary transition-colors py-2">
                  Discover <ChevronDown className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 space-y-1" align="start">
                  {discoveryLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(link.to) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </PopoverContent>
              </Popover>
            </li>

            {/* Tools Dropdown */}
            <li>
              <Popover>
                <PopoverTrigger className="flex items-center gap-1 hover:text-primary transition-colors py-2">
                  Tools <ChevronDown className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 space-y-1" align="start">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(link.to) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </PopoverContent>
              </Popover>
            </li>
          </ul>

          {/* Notification bell + Saved jobs for logged-in users */}
          {user && (
            <div className="flex items-center gap-1">
              {user.role === "Student" && (
                <Link to="/saved-jobs" className="p-2 rounded-lg hover:bg-muted/60 transition-colors" title="Saved Jobs">
                  <Bookmark className="h-5 w-5 text-foreground/70" />
                </Link>
              )}
              <NotificationBell />
            </div>
          )}

          {/* Theme toggle for non-logged-in users */}
          {!user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt={user?.fullname}
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname}
                    />
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{user?.fullname}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user?.profile?.bio || user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col pt-2 space-y-1">
                  {user?.role === "Student" && (
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-9"
                      onClick={() => navigate("/Profile")}
                    >
                      <User2 className="h-4 w-4" />
                      Profile
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="justify-start gap-2 h-9"
                    onClick={toggleTheme}
                  >
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ThemeIcon className="h-4 w-4" />
                    </motion.div>
                    {themeLabel} Mode
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start gap-2 h-9 text-destructive hover:text-destructive"
                    onClick={logoutHandler}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            <ThemeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Primary Links */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Primary</p>
                {studentLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl font-medium ${
                      isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground/70"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Discover Links */}
              <div className="space-y-1 pt-2 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Discover</p>
                {discoveryLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl font-medium ${
                      isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground/70"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Tools Links */}
              <div className="space-y-1 pt-2 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Career Tools</p>
                {toolLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl font-medium ${
                      isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground/70"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>

              {!user ? (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1 pt-2 border-t border-border">
                  {user?.role === "Student" && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        navigate("/Profile");
                        setMobileOpen(false);
                      }}
                    >
                      <User2 className="h-4 w-4" />
                      Profile
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      logoutHandler();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
