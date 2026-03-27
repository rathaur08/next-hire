
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_TYPE, WORK_TYPE, JOB_LEVEL } from "@/config/constant";

export const JobFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("searchParams: ", searchParams);
  console.log("searchParams string: ", searchParams.toString());

  // Local state for immediate UI feedback
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [jobLevel, setJobLevel] = useState(searchParams.get("jobLevel") || "");
  const [workType, setWorkType] = useState(searchParams.get("workType") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ search: search });
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    console.log("params: ", params);

    Object.entries(newParams).forEach(([key, value]) => {
      const actualValue = value?.trim();

      if (!actualValue || actualValue === "all") {
        params.delete(key);
      } else {
        params.set(key, actualValue);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // const updateFilters = (newParams: Record<string, string | null>) => {};

  const clearFilters = () => {
    setSearch("");
    setJobType("");
    setJobLevel("");
    setWorkType("");

    const pathname = "/dashboard/jobs";
    router.push(pathname); // Reset to base URL
  };

  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
      {/* --- Row 1: Search --- */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by title, skill, or company..."
          className="pl-10 h-11 bg-gray-50/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- Row 2: Filters --- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Job Type Dropdown */}
        <Select
          value={jobType}
          onValueChange={(val) => {
            setJobType(val);
            updateFilters({ jobType: val });
          }}
        >
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {JOB_TYPE.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Job Type Dropdown */}
        <Select
          value={jobLevel}
          onValueChange={(val) => {
            setJobLevel(val);
            updateFilters({ jobLevel: val });
          }}
        >
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Job Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {JOB_LEVEL.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Work Type Dropdown */}
        <Select
          value={workType}
          onValueChange={(val) => {
            setWorkType(val);
            updateFilters({ workType: val });
          }}
        >
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Work Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Work Styles</SelectItem>
            {WORK_TYPE.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button (Only show if filters are active) */}
        {(search || jobType || jobLevel || workType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="mr-2 h-3 w-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};