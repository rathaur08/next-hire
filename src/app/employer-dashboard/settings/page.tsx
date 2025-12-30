import EmployerSettingForm from "@/features/employers/components/EmployerSettingForm";
import { EmployerProfileData } from "@/features/employers/EmployerSchema";
import { getCurrentEmployerDetails } from "@/features/server/EmployersQueries";
import { redirect } from "next/navigation";

const EmployerSettings = async () => {
  const employer = await getCurrentEmployerDetails();

  if (!employer) return redirect("/login");

  // console.log("currentEmployer: ", employer);

  return (
    <>
      <div>
        <h1> Employer Setting Page </h1>

        {/* Employer Setting Form Components */}
        <EmployerSettingForm
          initialData={
            {
              name: employer.employerDetails.name,
              description: employer.employerDetails.description,
              organizationType: employer.employerDetails.organizationType,
              teamSize: employer.employerDetails.teamSize,
              location: employer.employerDetails.location,
              websiteUrl: employer.employerDetails.websiteUrl,
              yearOfEstablishment:
                employer.employerDetails.yearOfEstablishment?.toString(),
              avatarUrl: employer.avatarUrl,
              // bannerImageUrl: employer.employerDetails.bannerImageUrl,
            } as EmployerProfileData
          }
        />
      </div>
    </>
  );
};

export default EmployerSettings;
