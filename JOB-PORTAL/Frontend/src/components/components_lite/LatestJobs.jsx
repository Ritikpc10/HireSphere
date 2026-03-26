import React from "react";
import JobCards from "./JobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);

  return (
    <div className="max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="text-primary">Latest & Top </span>Job Openings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        {allJobs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-10">
            No jobs available at the moment.
          </p>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) =>
              job?._id ? (
                <JobCards key={job._id} job={job} />
              ) : null
            )
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
