import Link from "next/link";
import Image from "next/image";
import { MapPin, CheckCircle2, ArrowRight, Building2 } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getAppliedJobsForApplicant } from "@/features/applicants/server/ApplicantQueries";
import { redirect } from "next/navigation";

export async function RecentApplications() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  const allApplications = await getAppliedJobsForApplicant(user.id);

  const recentApplications = allApplications.slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <h3 className="font-semibold text-gray-900">Recently Applied</h3>
        <Link
          href="/dashboard/applied-jobs"
          className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {recentApplications && recentApplications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="w-[40%] pl-6">Job</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplications &&
              recentApplications.map((app) => {
                const { application, job, employer } = app;

                return (
                  <TableRow key={application.id} className="hover:bg-gray-50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 overflow-hidden border">
                          {employer?.bannerImageUrl ? (
                            <Image
                              src={employer.bannerImageUrl}
                              alt={employer.name || "Company"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-gray-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 line-clamp-1">
                              {job.title}
                            </span>
                            <Badge className="rounded-full px-2 py-0.5 text-[10px] font-normal border-0 bg-blue-100 text-blue-700 hover:bg-blue-100 whitespace-nowrap">
                              {job.jobType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{" "}
                              {job.location || "Remote"}
                            </span>
                            {(job.minSalary || job.maxSalary) && (
                              <span>
                                {job.salaryCurrency} {job.minSalary}-
                                {job.maxSalary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-gray-500">
                      {format(new Date(application.appliedAt), "MMM d, yyyy")}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Applied
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium"
                        asChild
                      >
                        <Link href={`/dashboard/jobs/${job.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
