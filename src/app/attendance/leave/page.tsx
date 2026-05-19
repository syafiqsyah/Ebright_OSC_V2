import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/app/components/AppShell";
import LeaveRequestsView, {
  type LeaveRow,
  type LeaveStatusCounts,
} from "@/app/components/LeaveRequestsView";
import { listApprovalRows } from "./approvals/queries";

export const dynamic = "force-dynamic";

export default async function LeavePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const params = await searchParams;
  const initialTab = params.tab === "team" ? "team" : "mine";

  const me = await prisma.users.findUnique({
    where: { email: session.user.email },
    select: {
      user_id: true,
      employment: {
        where: { status: "active" },
        take: 1,
        select: { department: { select: { department_code: true, department_name: true } } },
      },
    },
  });
  if (!me) redirect("/login");

  const userRole = (session.user as { role?: string } | undefined)?.role ?? "";
  const userPosition = (session.user as { position?: string | null } | undefined)?.position ?? "";

  const myDept = me.employment[0]?.department;
  const deptCode = myDept?.department_code?.toUpperCase() ?? "";
  const deptName = myDept?.department_name?.toLowerCase() ?? "";
  const isHR = deptCode === "HR" || deptName.includes("human resource");
  const viewOnly = userRole === "superadmin" || isHR;

  const requests = await prisma.leave_request.findMany({
    where: viewOnly ? {} : { user_id: me.user_id },
    orderBy: { applied_at: "desc" },
    include: {
      leave_types: { select: { leave_type_code: true, name: true } },
      users_leave_request_user_idTousers: viewOnly
        ? {
            select: {
              email: true,
              user_profile: { select: { full_name: true } },
            },
          }
        : false,
    },
  });

  const rows: LeaveRow[] = requests.map((r) => {
    const u = (r as typeof r & {
      users_leave_request_user_idTousers?: {
        email: string;
        user_profile: { full_name: string } | null;
      };
    }).users_leave_request_user_idTousers;
    const employeeName = u
      ? (u.user_profile?.full_name?.trim() || u.email.split("@")[0])
      : undefined;
    return {
      leaveId: r.leave_id,
      displayId: `LV-${String(r.leave_id).padStart(3, "0")}`,
      leaveTypeCode: r.leave_types.leave_type_code,
      leaveTypeName: r.leave_types.name,
      startDate: r.start_date.toISOString().slice(0, 10),
      endDate: r.end_date.toISOString().slice(0, 10),
      totalDays: Number(r.total_days),
      reason: r.reason,
      status: r.status,
      appliedAt: r.applied_at.toISOString(),
      employeeName,
    };
  });

  const counts: LeaveStatusCounts = {
    total: rows.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };
  for (const r of rows) {
    if (r.status in counts) counts[r.status as keyof LeaveStatusCounts] += 1;
  }

  const userEmail = session.user?.email ?? "";
  const userName = session.user?.name ?? null;

  const canApprove = userRole === "superadmin" || userPosition === "FT HOD";
  const approvalRows = canApprove ? await listApprovalRows(me.user_id, userRole) : [];

  return (
    <AppShell email={userEmail} role={userRole} name={userName}>
      <LeaveRequestsView
        rows={rows}
        counts={counts}
        canApprove={canApprove}
        initialTab={initialTab}
        approvalRows={approvalRows}
        viewOnly={viewOnly}
      />
    </AppShell>
  );
}
