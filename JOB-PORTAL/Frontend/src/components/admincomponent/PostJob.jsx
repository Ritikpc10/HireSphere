import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const { token } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response?.data) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center w-full my-5 px-4">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl w-full border border-border shadow-sm rounded-xl bg-card"
        >
          <h2 className="text-xl font-bold mb-6">Post a New Job</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                placeholder="Enter job title"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={input.description}
                placeholder="Enter job description"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                placeholder="Enter job location"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary (LPA)</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                placeholder="Enter salary in LPA"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>No. of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                placeholder="Positions available"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                placeholder="e.g. React, Node.js, MongoDB"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                placeholder="Min experience in years"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                placeholder="Full-Time / Part-Time / Internship"
                className="my-1"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              {companies.length > 0 && (
                <div>
                  <Label>Company</Label>
                  <Select onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company.name.toLowerCase()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Post Job
              </Button>
            )}
          </div>
          {companies.length === 0 && (
            <p className="text-sm font-bold my-3 text-center text-destructive">
              *Please register a company first to post jobs.*
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
