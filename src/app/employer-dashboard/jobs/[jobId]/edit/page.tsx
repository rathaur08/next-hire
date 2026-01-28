import { EmployerJobsForm } from "@/features/employers/components/EmployerJobsForm";
import { getJobByIdAction } from "@/features/server/JobsAction";
import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: { jobId: string };
}

export const EditJobPage = async ({ params }: EditJobPageProps) => {
  const { jobId } = await params; // 👈 await params
  const id = Number(jobId);

  // if (Number.isNaN(id)) {
  //   throw new Error("Invalid jobId");
  // }

  if (Number.isNaN(id)) redirect("/employer-dashboard/jobs");

  // // 1. Fetch Data
  const { status, data: job } = await getJobByIdAction(id);
  console.log("Job Data after ID: ", job);

  // 2. Handle Errors (e.g., user manually types a random ID)
  if (status === "ERROR" || !job) {
    redirect("/employer-dashboard/jobs");
  }

  return (
    <div>
      {/* <div className="max-w-3xl mx-auto py-8"> */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
      </div>

      {/* 3. Pass the fetched data to the form */}
      <EmployerJobsForm initialData={job} isEditMode={true} />
    </div>
  );
};

export default EditJobPage;
