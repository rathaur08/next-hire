import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { JobCardProps } from "../jobs/types/JobTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const EmployerJobCard = ({ job, onDelete, onEdit }: JobCardProps) => {
  return (
    <Card className="hover:shadow-md transition cursor-pointer">
      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{job.title}</h3>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit?.(job.id)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            {/* <Button size="icon" variant="ghost" className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button> */}

            {/* Delete with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the job listing for
                    <span className="font-semibold text-foreground">
                      "{job.title}"
                    </span>
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete?.(job.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">{job.jobType}</Badge>
          <Badge variant="secondary">{job.workType}</Badge>
          <Badge variant="secondary">{job.jobLevel}</Badge>
        </div>

        {job.location && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {job.location}
          </p>
        )}

        {job.minSalary && job.maxSalary && (
          <p className="text-sm font-medium">
            {job.salaryCurrency} {job.minSalary} - {job.maxSalary} /
            {job.salaryPeriod}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
