import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/app/components/AppShell";
import EmployeeListView from "@/app/components/EmployeeListView";
import type { OverviewStats } from "@/app/components/EmployeeDashboardOverviewSection";
import { listEmployees, listBranches, listDepartments } from "@/lib/employeeQueries";

export const dynamic = "force-dynamic";

export default async function EmployeeManagementPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [
    employees,
    branches,
    departments,
    totalStaff,
    branchCount,
    departmentCount,
    onboardingActive,
    onboardingCompleted,
  ] = await Promise.all([
    listEmployees(),
    listBranches(),
    listDepartments(),
    prisma.users.count({ where: { status: "active" } }),
    prisma.branch.count(),
    prisma.department.count(),
    prisma.induction_profile.count({
      where: {
        induction_type: "Onboarding",
        status: { in: ["Sent", "In Progress", "Created"] },
      },
    }),
    prisma.induction_profile.count({
      where: { induction_type: "Onboarding", status: "Completed" },
    }),
  ]);

  const stats: OverviewStats = {
    totalStaff,
    branchCount,
    departmentCount,
    onboardingActive,
    onboardingCompleted,
  };

  const userEmail = session.user?.email ?? "";
  const userRole = (session.user as { role?: string } | undefined)?.role ?? "";
  const userName = session.user?.name ?? null;

  return (
    <AppShell email={userEmail} role={userRole} name={userName}>
      <EmployeeListView
        employees={employees}
        branches={branches}
        departments={departments}
        overviewStats={stats}
      />
    </AppShell>
  );
}
