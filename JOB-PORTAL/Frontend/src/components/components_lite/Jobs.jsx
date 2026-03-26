import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!searchedQuery || searchedQuery.trim() === "") {
      setFilterJobs(allJobs);
      return;
    }

    const filteredJobs = allJobs.filter((job) => {
      const query = searchedQuery.toLowerCase();
      return (
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.jobType?.toLowerCase().includes(query) ||
        String(job.salary)?.toLowerCase().includes(query)
      );
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full mt-5 px-6 lg:px-12">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilter(!showFilter)}
            className="gap-2"
          >
            {showFilter ? (
              <X className="h-4 w-4" />
            ) : (
              <SlidersHorizontal className="h-4 w-4" />
            )}
            {showFilter ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex gap-5">
          {/* Sidebar filter */}
          <div
            className={`${
              showFilter ? "block" : "hidden"
            } lg:block w-full lg:w-[280px] shrink-0 mb-4 lg:mb-0`}
          >
            <FilterCard />
          </div>

          {/* Job grid */}
          {filterJobs.length <= 0 ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <p className="text-muted-foreground text-lg">No jobs found</p>
            </div>
          ) : (
            <div className="flex-1 pb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={job._id}
                  >
                    <Job1 job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
