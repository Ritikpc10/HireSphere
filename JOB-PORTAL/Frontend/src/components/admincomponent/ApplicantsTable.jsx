import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircle2, XCircle, FileText, Eye, X, ExternalLink, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const { token } = useSelector((store) => store.auth);
  const [statusMap, setStatusMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [resumePreview, setResumePreview] = useState(null);

  const statusHandler = async (status, id) => {
    setLoadingMap((prev) => ({ ...prev, [id]: status }));
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (res.data.success) {
        setStatusMap((prev) => ({ ...prev, [id]: status.toLowerCase() }));
        toast.success(`Applicant ${status.toLowerCase()}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: null }));
    }
  };

  const getStatusBadge = (item) => {
    const status = statusMap[item._id] || item.status || "pending";
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-200 gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 gap-1">
            ⏳ Pending
          </Badge>
        );
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const currentStatus = (item) => statusMap[item._id] || item.status || "pending";

  return (
    <>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableCaption className="py-4">
            {applicants?.applications?.length || 0} applicant(s) for this position
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Applicant</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Resume</TableHead>
              <TableHead className="font-semibold">Applied</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants?.applications?.length > 0 ? (
              applicants.applications.map((item, i) => (
                <TableRow
                  key={item._id}
                  className="opacity-0 animate-fadeSlideIn"
                  style={{ animationFillMode: "forwards", animationDelay: `${i * 60}ms` }}
                >
                  {/* Applicant */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-lg border border-border">
                        <AvatarImage src={item?.applicant?.profile?.profilePhoto} />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          {getInitials(item?.applicant?.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{item?.applicant?.fullname}</p>
                        <p className="text-xs text-muted-foreground">{item?.applicant?.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell className="text-sm">
                    {item?.applicant?.phoneNumber || "—"}
                  </TableCell>

                  {/* Resume */}
                  <TableCell>
                    {item?.applicant?.profile?.resume ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1 text-primary"
                          onClick={() => setResumePreview(item.applicant.profile.resume)}
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                        <a
                          href={item.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary"
                        >
                          <Download className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No resume</span>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(item?.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(item)}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {currentStatus(item) === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => statusHandler("Accepted", item._id)}
                          disabled={!!loadingMap[item._id]}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {loadingMap[item._id] === "Accepted" ? "..." : "Accept"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => statusHandler("Rejected", item._id)}
                          disabled={!!loadingMap[item._id]}
                        >
                          <XCircle className="h-3 w-3" />
                          {loadingMap[item._id] === "Rejected" ? "..." : "Reject"}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Decision made
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No applicants yet</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resume Preview Modal */}
      {resumePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col opacity-0 animate-scaleIn" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Resume Preview
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={resumePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" /> Open in new tab
                </a>
                <button
                  onClick={() => setResumePreview(null)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={resumePreview}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantsTable;
