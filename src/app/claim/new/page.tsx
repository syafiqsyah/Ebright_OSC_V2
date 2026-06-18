import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/app/components/AppShell";
import NewClaimView from "@/app/components/NewClaimView";

export const dynamic = "force-dynamic";

export default async function NewClaimPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userEmail = session.user?.email ?? "";
  const userRole = (session.user as { role?: string } | undefined)?.role ?? "";
  const userName = session.user?.name ?? null;

  return (
    <AppShell email={userEmail} role={userRole} name={userName}>
      <NewClaimView />
    </AppShell>
  );
}
