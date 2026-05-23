import { HRMSSidebar } from "@/app/induction/components/HRMSSidebar";

export const dynamic = "force-static";

export const metadata = {
  title: "HRMSSidebar Preview",
};

/**
 * Public no-auth preview of the HRMSSidebar component (Phase 2A spec v2).
 *
 * Shows the sidebar rendered in three different prop combinations side-by-side
 * so reviewers can see all visual states without needing to log in. Lives at
 * /preview/hrms-sidebar — accessible to anyone who can reach the staging URL.
 *
 * If we ever want to retire this page, delete src/app/preview/hrms-sidebar/.
 */
export default function HRMSSidebarPreview() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Component preview · no login required
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-slate-900">
            HRMSSidebar — Phase 2A
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            The HRMS sub-sidebar reorganized into Main / Management / Tools groups
            per spec v2. Renders side-by-side here in three prop variants. Only
            visible on md+ screens (the real sidebar is desktop-only via{" "}
            <code className="text-xs bg-slate-200 px-1 rounded">hidden md:flex</code>).
          </p>
        </header>

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          <PreviewCard
            label="HR / Admin · with badge + footer"
            description="canManageInductions=true, onboardingCount=12, userName + role + email passed. This is what HR users will eventually see once Phase 2B wires up the data."
          >
            <HRMSSidebar
              canManageInductions={true}
              onboardingCount={12}
              userName="Olivia Damon"
              userEmail="od@ebright.my"
              userRoleLabel="HR Manager"
            />
          </PreviewCard>

          <PreviewCard
            label="HR / Admin · current state"
            description="canManageInductions=true only. No badge, no footer. This is what HR sees today on staging (until Phase 2B wires the optional props)."
          >
            <HRMSSidebar canManageInductions={true} />
          </PreviewCard>

          <PreviewCard
            label="Regular staff · canManageInductions=false"
            description="Dashboard and Control Centre are role-gated and hidden. Placeholder 'Soon' items still show. This is what non-HR staff see."
          >
            <HRMSSidebar canManageInductions={false} />
          </PreviewCard>
        </div>

        <div className="md:hidden rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          The sidebar is desktop-only. Resize your viewport to ≥768px width to see
          the previews.
        </div>

        <footer className="mt-10 text-xs text-slate-500 space-y-1">
          <p>
            This preview page is intentionally public — no auth required. It
            exists at <code className="text-xs bg-slate-200 px-1 rounded">/preview/hrms-sidebar</code> for verifying UI changes
            without needing staging credentials.
          </p>
          <p>
            Note: clicking sidebar items here will navigate to the real routes
            (e.g. /induction/onboarding-dashboard). Most will redirect to login.
          </p>
        </footer>
      </div>
    </div>
  );
}

function PreviewCard({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
      <div className="flex-1 flex items-stretch">{children}</div>
    </div>
  );
}
