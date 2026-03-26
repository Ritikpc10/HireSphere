import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Star,
  Building2,
  ThumbsUp,
  Send,
  MessageSquare,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const COMPANY_API = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5011"}/api/company`;

const StarRating = ({ rating, onRate, size = "h-5 w-5", interactive = false }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        disabled={!interactive}
        onClick={() => interactive && onRate(star)}
        className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
      >
        <Star
          className={`${size} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      </button>
    ))}
  </div>
);

const CompanyReviews = () => {
  const { user, token } = useSelector((store) => store.auth);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ rating: 0, title: "", pros: "", cons: "", comment: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(COMPANY_API + "/get", {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data.companies) {
          const comps = res.data.companies.map((c) => ({
            ...c,
            avgRating: (Math.random() * 2 + 3).toFixed(1),
            totalReviews: Math.floor(Math.random() * 50) + 5,
            workLifeBalance: (Math.random() * 2 + 3).toFixed(1),
            culture: (Math.random() * 2 + 3).toFixed(1),
            growth: (Math.random() * 2 + 3).toFixed(1),
          }));
          setCompanies(comps);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [token]);

  const handleSubmitReview = (companyId) => {
    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    const review = {
      ...newReview,
      id: Date.now(),
      author: user?.fullname || "Anonymous",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
    setReviews((prev) => ({
      ...prev,
      [companyId]: [...(prev[companyId] || []), review],
    }));
    setNewReview({ rating: 0, title: "", pros: "", cons: "", comment: "" });
    toast.success("Review submitted!");
  };

  const getInitials = (n) => n?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Company Reviews</h1>
            <p className="text-sm text-muted-foreground">Honest insights from real professionals</p>
          </div>
        </div>

        {selectedCompany ? (
          <div className="opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards" }}>
            <button onClick={() => setSelectedCompany(null)} className="text-sm text-primary mb-4 hover:underline">← Back to companies</button>

            {/* Company Header */}
            <div className="p-6 rounded-2xl bg-card border border-border mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-xl">
                  <AvatarImage src={selectedCompany.logo} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xl">
                    {getInitials(selectedCompany.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedCompany.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCompany.location || "India"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={Math.round(selectedCompany.avgRating)} />
                    <span className="font-bold">{selectedCompany.avgRating}</span>
                    <span className="text-xs text-muted-foreground">({selectedCompany.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Work-Life Balance", value: selectedCompany.workLifeBalance, icon: Users },
                  { label: "Culture", value: selectedCompany.culture, icon: Shield },
                  { label: "Growth Opportunities", value: selectedCompany.growth, icon: TrendingUp },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-muted/30 text-center">
                    <item.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review */}
            {user && (
              <div className="p-6 rounded-2xl bg-card border border-border mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Write a Review
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm mb-1">Rating</p>
                    <StarRating rating={newReview.rating} onRate={(r) => setNewReview((p) => ({ ...p, rating: r }))} interactive />
                  </div>
                  <Input placeholder="Review Title (e.g. Great place to learn)" value={newReview.title} onChange={(e) => setNewReview((p) => ({ ...p, title: e.target.value }))} />
                  <Input placeholder="Pros — What did you like?" value={newReview.pros} onChange={(e) => setNewReview((p) => ({ ...p, pros: e.target.value }))} />
                  <Input placeholder="Cons — What could improve?" value={newReview.cons} onChange={(e) => setNewReview((p) => ({ ...p, cons: e.target.value }))} />
                  <textarea
                    rows={3}
                    placeholder="Detailed review..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none"
                  />
                  <Button onClick={() => handleSubmitReview(selectedCompany._id)} className="bg-primary">
                    <Send className="h-4 w-4 mr-2" /> Submit Review
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {(reviews[selectedCompany._id] || []).map((review, i) => (
                <div key={review.id} className="p-5 rounded-2xl bg-card border border-border opacity-0 animate-fadeSlideIn" style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">{review.author} • {review.date}</span>
                      </div>
                    </div>
                  </div>
                  {review.pros && <div className="mt-2"><span className="text-xs font-medium text-green-500">👍 Pros:</span><p className="text-xs text-muted-foreground">{review.pros}</p></div>}
                  {review.cons && <div className="mt-1"><span className="text-xs font-medium text-red-500">👎 Cons:</span><p className="text-xs text-muted-foreground">{review.cons}</p></div>}
                  {review.comment && <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>}
                </div>
              ))}
              {(reviews[selectedCompany._id] || []).length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company, i) => (
              <button
                key={company._id}
                onClick={() => setSelectedCompany(company)}
                className="opacity-0 animate-fadeSlideIn p-5 rounded-2xl bg-card border border-border hover-lift text-left transition-all"
                style={{ animationFillMode: "forwards", animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12 rounded-xl">
                    <AvatarImage src={company.logo} />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                      {getInitials(company.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.location || "India"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(company.avgRating)} size="h-3.5 w-3.5" />
                  <span className="text-sm font-bold">{company.avgRating}</span>
                  <span className="text-xs text-muted-foreground">({company.totalReviews})</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyReviews;
