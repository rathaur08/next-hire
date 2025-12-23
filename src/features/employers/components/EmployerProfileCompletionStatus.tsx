import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getCurrentEmployerDetails } from "@/features/server/EmployersQueries";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const EmployerProfileCompletionStatus = async () => {
  const currentEmployer = await getCurrentEmployerDetails();
  // console.log("current Employer data ", currentEmployer);

  if (!currentEmployer) return redirect("/login");

  if (currentEmployer.isProfileCompleted) return null;

  return (
    <>
      <div className="flex flex-col gap-6">
        <Item variant="destructive">
          <ItemMedia variant="icon" className="bg-destructive">
            <ShieldAlertIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Incomplete Profile</ItemTitle>
            <ItemDescription className="">
              You haven't completed your employer profile yet. Please complete
              your profile to post jobs and access all features.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="destructive" asChild>
              <Link href="/employer-dashboard/settings">Complete Profile</Link>
            </Button>
          </ItemActions>
        </Item>
      </div>
    </>
  );
};

export default EmployerProfileCompletionStatus;
