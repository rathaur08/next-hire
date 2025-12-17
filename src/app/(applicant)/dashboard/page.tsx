import { logoutUserAction } from "@/features/auth/server/auth.actions";

const ApplicantDashboard = () => {
  return (
    <>
      <div>
        <h1> Applicant Dashboard</h1>
        <button type="button" onClick={logoutUserAction}>
          Logout
        </button>
      </div>
    </>
  );
};

export default ApplicantDashboard;
