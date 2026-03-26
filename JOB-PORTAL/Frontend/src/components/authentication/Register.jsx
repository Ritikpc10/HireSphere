import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "Student",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading } = useSelector((store) => store.auth);
  const [localError, setLocalError] = useState("");
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const validation = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim());
    const fullnameOk = input.fullname.trim().length >= 2;
    const passwordOk = input.password.length >= 6;
    const phoneOk = input.phoneNumber.trim().length >= 7;
    const roleOk = input.role === "Student" || input.role === "Recruiter";
    const panOk = input.pancard.trim().length >= 8;
    const adharOk = input.adharcard.trim().length >= 10;
    return {
      emailOk,
      fullnameOk,
      passwordOk,
      phoneOk,
      roleOk,
      panOk,
      adharOk,
    };
  }, [input]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLocalError("");

    const invalid =
      !validation.fullnameOk ||
      !validation.emailOk ||
      !validation.passwordOk ||
      !validation.roleOk ||
      !validation.phoneOk ||
      !validation.panOk ||
      !validation.adharOk;

    if (invalid) {
      const msg = !validation.fullnameOk
        ? "Full name is too short."
        : !validation.emailOk
          ? "Please enter a valid email."
          : !validation.passwordOk
            ? "Password must be at least 6 characters."
            : !validation.phoneOk
              ? "Please enter a valid phone number."
              : !validation.panOk
                ? "Please enter a valid PAN card number."
                : !validation.adharOk
                  ? "Please enter a valid Adhar card number."
                  : "Please select a role.";
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("pancard", input.pancard);
    formData.append("adharcard", input.adharcard);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      setLocalError(errorMessage);
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const { user } = useSelector((store) => store.auth);
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
            Register
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Create your account to apply or post jobs.
          </p>

          <form onSubmit={submitHandler} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="John Doe"
              />
            </div>

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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>PAN card</Label>
                <Input
                  type="text"
                  value={input.pancard}
                  name="pancard"
                  onChange={changeEventHandler}
                  placeholder="ABCDE1234F"
                />
              </div>

              <div className="space-y-2">
                <Label>Adhar card</Label>
                <Input
                  type="text"
                  value={input.adharcard}
                  name="adharcard"
                  onChange={changeEventHandler}
                  placeholder="123456789012"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone number</Label>
              <Input
                type="tel"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="+1234567890"
              />
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

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label>Profile photo (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={ChangeFilehandler}
                className="cursor-pointer"
              />
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
                Register
              </button>
            )}

            <p className="pt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
