import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToken, setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "", 
    role: "Student",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const [localError, setLocalError] = useState("");
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validation = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim());
    const passwordOk = input.password.length >= 6;
    const roleOk = input.role === "Student" || input.role === "Recruiter";
    return { emailOk, passwordOk, roleOk };
  }, [input.email, input.password, input.role]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validation.emailOk || !validation.passwordOk || !validation.roleOk) {
      const msg = !validation.emailOk
        ? "Please enter a valid email."
        : !validation.passwordOk
          ? "Password must be at least 6 characters."
          : "Please select a role.";
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    try {
      dispatch(setLoading(true)); // Start loading
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setToken(res.data.token));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Login failed";
      setLocalError(errorMessage);
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false)); // End loading
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Login
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Welcome back. Sign in to continue.
          </p>

          <form onSubmit={submitHandler} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="johndoe@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="********"
              />
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Role</Label>
              <RadioGroup className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    name="role"
                    value="Student"
                    checked={input.role === "Student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer accent-primary"
                  />
                  <Label>Student</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="radio"
                    name="role"
                    value="Recruiter"
                    checked={input.role === "Recruiter"}
                    onChange={changeEventHandler}
                    className="cursor-pointer accent-primary"
                  />
                  <Label>Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            {localError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {localError}
              </div>
            ) : null}

            {loading ? (
              <div className="flex items-center justify-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Login
              </button>
            )}

            <p className="pt-2 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
