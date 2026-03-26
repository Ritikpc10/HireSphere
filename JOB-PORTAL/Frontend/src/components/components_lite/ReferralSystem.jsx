import React, { useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Gift,
  Copy,
  Share2,
  Users,
  Trophy,
  Star,
  CheckCircle2,
  Sparkles,
  Medal,
} from "lucide-react";
import { toast } from "sonner";

const rewards = [
  { points: 50, label: "Bronze Referrer", icon: Medal, color: "text-amber-700" },
  { points: 150, label: "Silver Referrer", icon: Star, color: "text-gray-400" },
  { points: 300, label: "Gold Referrer", icon: Trophy, color: "text-yellow-500" },
  { points: 500, label: "Platinum Referrer", icon: Sparkles, color: "text-purple-500" },
];

const demoReferrals = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", status: "joined", date: "20 Mar", points: 50 },
  { name: "Priya Gupta", email: "priya@gmail.com", status: "applied", date: "18 Mar", points: 25 },
  { name: "Arjun Patel", email: "arjun@gmail.com", status: "pending", date: "15 Mar", points: 0 },
];

const ReferralSystem = () => {
  const { user } = useSelector((store) => store.auth);
  const [referrals] = useState(demoReferrals);
  const [email, setEmail] = useState("");

  const referralCode = user?.fullname
    ? `HIRE-${user.fullname.replace(/\s/g, "").substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    : "HIRE-GUEST-XXXX";

  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
  const totalPoints = referrals.reduce((acc, r) => acc + r.points, 0);
  const currentTier = rewards.filter((r) => totalPoints >= r.points).pop() || rewards[0];
  const nextTier = rewards.find((r) => totalPoints < r.points);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const sendInvite = () => {
    if (!email) return;
    toast.success(`Invite sent to ${email}!`);
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Refer & Earn</h1>
            <p className="text-sm text-muted-foreground">Invite friends, earn rewards — everyone wins!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Referral Card + Invite */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Link Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-2">Your Referral Code</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 p-3 rounded-xl bg-card border border-border font-mono text-sm break-all">
                  {referralCode}
                </div>
                <Button onClick={copyLink} variant="outline" size="icon" className="shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Share your link:</p>
              <div className="flex items-center gap-2">
                <Input className="text-xs" value={referralLink} readOnly />
                <Button onClick={copyLink} size="sm" className="bg-primary shrink-0">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            </div>

            {/* Invite by Email */}
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-100" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-3">Invite by Email</h3>
              <div className="flex gap-2">
                <Input placeholder="friend@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button onClick={sendInvite} className="bg-primary shrink-0">Send Invite</Button>
              </div>
            </div>

            {/* Referral History */}
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-200" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Your Referrals
              </h3>
              <div className="space-y-3">
                {referrals.map((ref, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{ref.name}</p>
                      <p className="text-xs text-muted-foreground">{ref.email} • {ref.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs capitalize ${
                        ref.status === "joined" ? "text-green-600 border-green-200" :
                        ref.status === "applied" ? "text-blue-600 border-blue-200" :
                        "text-yellow-600 border-yellow-200"
                      }`}>
                        {ref.status === "joined" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {ref.status}
                      </Badge>
                      {ref.points > 0 && (
                        <span className="text-xs font-bold text-primary">+{ref.points} pts</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Points & Rewards */}
          <div className="space-y-6">
            {/* Points Card */}
            <div className="p-6 rounded-2xl bg-card border border-border text-center opacity-0 animate-fadeSlideIn delay-100" style={{ animationFillMode: "forwards" }}>
              <currentTier.icon className={`h-12 w-12 mx-auto mb-3 ${currentTier.color}`} />
              <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              <p className="text-sm text-muted-foreground mb-2">Total Points</p>
              <Badge className="bg-primary/10 text-primary">{currentTier.label}</Badge>
              {nextTier && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{totalPoints} pts</span>
                    <span>{nextTier.points} pts</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${(totalPoints / nextTier.points) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {nextTier.points - totalPoints} points to {nextTier.label}
                  </p>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-200" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-4">How It Works</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Share your referral link", pts: "" },
                  { step: "2", text: "Friend registers on HireSphere", pts: "+50 pts" },
                  { step: "3", text: "Friend applies to a job", pts: "+25 pts" },
                  { step: "4", text: "Friend gets hired!", pts: "+100 pts" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <span className="text-sm flex-1">{item.text}</span>
                    {item.pts && <span className="text-xs font-bold text-green-500">{item.pts}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Reward Tiers */}
            <div className="p-6 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn delay-300" style={{ animationFillMode: "forwards" }}>
              <h3 className="font-semibold mb-3">Reward Tiers</h3>
              <div className="space-y-2">
                {rewards.map((r) => (
                  <div key={r.label} className={`flex items-center gap-3 p-2 rounded-lg ${totalPoints >= r.points ? "bg-primary/5" : "opacity-50"}`}>
                    <r.icon className={`h-5 w-5 ${r.color}`} />
                    <span className="text-sm flex-1">{r.label}</span>
                    <span className="text-xs font-bold">{r.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
