import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  TrendingUp,
  Trash2,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5011";
const ADMIN_API = `${API_BASE}/api/admin`;

const useCounter = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) { setCount(0); return; }
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

const AdminPanel = () => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/stats`, {
        withCredentials: true,
        headers,
      });
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin stats. You may not have admin access.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page: userPage, limit: 15 });
      if (userSearch) params.append("search", userSearch);
      if (roleFilter) params.append("role", roleFilter);
      const res = await axios.get(`${ADMIN_API}/users?${params}`, {
        withCredentials: true,
        headers,
      });
      if (res.data.success) {
        setUsers(res.data.users);
        setUserTotal(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStats(); }, [token]);
  useEffect(() => { fetchUsers(); }, [token, userPage, userSearch, roleFilter]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      const res = await axios.delete(`${ADMIN_API}/users/${userId}`, {
        withCredentials: true,
        headers,
      });
      if (res.data.success) {
        toast.success("User deleted");
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const stats = data?.stats || {};
  const getInitials = (n) => n?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 rounded-2xl animate-shimmer bg-card border border-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="opacity-0 animate-fadeSlideIn mb-8 flex items-center gap-3" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Platform management & overview</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Users", value: stats.totalUsers || 0, color: "from-blue-500 to-cyan-500" },
            { icon: Briefcase, label: "Total Jobs", value: stats.totalJobs || 0, color: "from-violet-500 to-purple-600" },
            { icon: FileText, label: "Applications", value: stats.totalApplications || 0, color: "from-orange-500 to-amber-500" },
            { icon: Building2, label: "Companies", value: stats.totalCompanies || 0, color: "from-green-500 to-emerald-500" },
          ].map((stat, i) => {
            const animVal = useCounter(stat.value);
            return (
              <div
                key={stat.label}
                className="opacity-0 animate-fadeSlideIn p-5 rounded-2xl text-white relative overflow-hidden hover-lift"
                style={{
                  animationFillMode: "forwards",
                  animationDelay: `${i * 100}ms`,
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`} />
                <div className="relative z-10">
                  <stat.icon className="h-5 w-5 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{animVal}</p>
                  <p className="text-xs opacity-80">{stat.label}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/10" />
              </div>
            );
          })}
        </div>

        {/* Role Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Students", value: stats.students || 0, emoji: "🎓" },
            { label: "Recruiters", value: stats.recruiters || 0, emoji: "💼" },
            { label: "Accepted", value: stats.accepted || 0, emoji: "✅" },
            { label: "Pending", value: stats.pending || 0, emoji: "⏳" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="opacity-0 animate-fadeSlideIn p-4 rounded-2xl bg-card border border-border hover-lift"
              style={{ animationFillMode: "forwards", animationDelay: `${(i + 4) * 100}ms` }}
            >
              <span className="text-lg">{item.emoji}</span>
              <p className="text-xl font-bold mt-1">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-2">
          {["overview", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Recent Users
              </h3>
              <div className="space-y-3">
                {data?.recentUsers?.map((u, i) => (
                  <div
                    key={u._id}
                    className="opacity-0 animate-fadeSlideIn flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={u.profile?.profilePhoto} />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs">
                          {getInitials(u.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{u.fullname}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">{u.role}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Recent Jobs
              </h3>
              <div className="space-y-3">
                {data?.recentJobs?.map((j, i) => (
                  <div
                    key={j._id}
                    className="opacity-0 animate-fadeSlideIn flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
                  >
                    <div>
                      <p className="font-medium text-sm">{j.title}</p>
                      <p className="text-xs text-muted-foreground">{j.company?.name} • {j.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{j.salary} LPA</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="p-6 rounded-2xl bg-card border border-border">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {["", "Student", "Recruiter"].map((r) => (
                  <Button
                    key={r || "all"}
                    variant={roleFilter === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setRoleFilter(r); setUserPage(1); }}
                  >
                    {r || "All"}
                  </Button>
                ))}
              </div>
            </div>

            {/* User List */}
            <div className="space-y-2">
              {users.map((u, i) => (
                <div
                  key={u._id}
                  className="opacity-0 animate-fadeSlideIn flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors"
                  style={{ animationFillMode: "forwards", animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg">
                      <AvatarImage src={u.profile?.profilePhoto} />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                        {getInitials(u.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{u.fullname}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs capitalize">{u.role}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {userTotal > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={userPage <= 1}
                  onClick={() => setUserPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {userPage} of {userTotal}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={userPage >= userTotal}
                  onClick={() => setUserPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
