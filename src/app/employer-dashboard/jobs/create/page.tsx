import { EmployerJobsForm } from "@/features/employers/components/EmployerJobsForm";

const EmployerJobs = () => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Post a New Jobs
        </h1>
        <EmployerJobsForm />
      </div>
    </>
  );
};

export default EmployerJobs;
