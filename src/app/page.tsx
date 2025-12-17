import React from "react";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { log } from "console";

const page = async () => {
  const user = await getCurrentUser();
  log("Current User:", user);

  return (
    <>
      <div>
        <h1>Welcome to the Home Page</h1>
        <h2> Hi {user?.name} </h2>
      </div>
    </>
  );
};

export default page;
