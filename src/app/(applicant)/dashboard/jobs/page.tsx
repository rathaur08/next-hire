import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/employers/jobs/components/jobCard";
import { getAllJobs } from "@/features/employers/jobs/server/JobsQueries";
import Link from "next/link";
import React from "react";

const page = async () => {
  // Fetch Data  jobs
  const jobs = await getAllJobs();

  // console.log("jobs", jobs);

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Find your Next Dream Job
          </h1>
          <p className="text-gray-500">
            Browse latest job openings from top companies.
          </p>
        </div>

        {/* 3. Add the Filter Component Here */}
        {/* <JobFilters /> */}

        {/* Job Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No jobs found
            </h3>
            <p className="text-gray-500">
              Check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
