import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full my-10 px-6 lg:px-12">
        <h1 className="font-bold text-xl my-6">
          Search Results ({allJobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {allJobs.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-20">
              No jobs found. Try a different search.
            </p>
          ) : (
            allJobs.map((job) => <Job1 key={job._id} job={job} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
