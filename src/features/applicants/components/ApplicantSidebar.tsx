"use client";

import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const base = "/dashboard";

const navigationItems = [
  { name: "Home", icon: LayoutDashboard, href: base + "/" },
  { name: "Find Jobs", icon: Search, href: base + "/jobs" },
  { name: "Applied", icon: Briefcase, href: base + "/applications" },
  { name: "Saved Jobs", icon: Bookmark, href: base + "/saved-jobs" },
  { name: "Settings", icon: Settings, href: base + "/settings" },
];

const ApplicantSidebar = () => {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/dashboard/") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
      <div className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Applicant Dashboard
        </h2>
      </div>

      <nav className="px-3 space-y-1">
        {navigationItems.map((curNav) => {
          const Icon = curNav.icon;

          return (
            <Link
              key={curNav.name}
              href={curNav.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isLinkActive(curNav.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {curNav.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <form action={logoutUserAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium
                       text-muted-foreground hover:text-foreground hover:bg-accent
                       rounded-lg transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Log-out
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicantSidebar;
