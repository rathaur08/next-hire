import { EmployerJobsList } from "@/features/employers/components/EmployerJobsList";

const JobsList = () => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Job Post</h1>
        <EmployerJobsList />
      </div>
    </>
  );
};

export default JobsList;
