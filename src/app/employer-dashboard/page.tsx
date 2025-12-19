import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerProfileCompletionStatus from "@/features/employers/components/EmployerProfileCompletionStatus";
import StatsCards from "@/features/employers/components/EmployersStatsCards";
import { redirect } from "next/navigation";

const EmployerDashboard = async () => {
  const user = await getCurrentUser();
  // console.log("user data employer: ", user);

  if (!user) return redirect("/login");

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Hello,{" "}
            <span className="capitalize">{user?.name.toLowerCase()}</span>
          </h1>
          <p className="text-muted-foreground">
            Here is your daily activities and appLications
          </p>

          {/* Stats Cards */}
          <StatsCards />

            <EmployerProfileCompletionStatus />
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
