import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import Navbar from "./Navbar";
import { Mail, ArrowLeft, KeyRound, Lock, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: code+newPass, 3: success
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/forgot-password`, { email });
      if (res.data.success) {
        toast.success("Reset code generated! Check your email.");
        // In dev mode, the code is returned in the response
        if (res.data.resetCode) {
          setResetCode(res.data.resetCode);
          toast.info(`Dev mode: Your reset code is ${res.data.resetCode}`);
        }
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) return toast.error("Fill all fields");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/reset-password`, {
        email,
        resetCode,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password reset successfully!");
        setStep(3);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="opacity-0 animate-fadeSlideIn p-8 rounded-2xl bg-card border border-border shadow-xl" style={{ animationFillMode: "forwards" }}>
            {step === 1 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Forgot Password?</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your email to receive a reset code
                    </p>
                  </div>
                </div>
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div>
                    <Label htmlFor="fp-email">Email Address</Label>
                    <Input
                      id="fp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <KeyRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Enter Reset Code</h2>
                    <p className="text-sm text-muted-foreground">
                      Code sent to {email}
                    </p>
                  </div>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="fp-code">6-Digit Reset Code</Label>
                    <Input
                      id="fp-code"
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="mt-1 text-center text-lg tracking-widest font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fp-newpass">New Password</Label>
                    <Input
                      id="fp-newpass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Password Reset!</h2>
                <p className="text-muted-foreground mb-6">
                  Your password has been updated successfully
                </p>
                <Button
                  onClick={() => navigate("/Login")}
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                >
                  <Lock className="h-4 w-4 mr-2" /> Login Now
                </Button>
              </div>
            )}

            {step !== 3 && (
              <div className="mt-4 text-center">
                <Link
                  to="/Login"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
