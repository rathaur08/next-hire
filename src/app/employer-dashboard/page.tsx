import { logoutUserAction } from "@/features/auth/server/auth.actions";

const EmployerDashboard = () => {
  return (
    <>
      <div>
        <h1> Employer Dashboard</h1>
        <button type="button" onClick={logoutUserAction}>
          Logout
        </button>
      </div>
    </>
  );
};

export default EmployerDashboard;
