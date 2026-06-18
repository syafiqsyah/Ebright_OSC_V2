"use client";

import { PanelLeftClose, PanelLeftOpen, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import UserHeader from "./UserHeader";
import NotificationBell from "./NotificationBell";
import { useBreadcrumbContext } from "./BreadcrumbContext";

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  email?: string;
  role?: string;
  name?: string | null;
}

export default function TopBar({ onToggleSidebar, sidebarCollapsed, email, role, name }: TopBarProps) {
  const ToggleIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;
  const { items } = useBreadcrumbContext();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="h-full flex items-center gap-3 px-4 md:px-6">
        {/* Left: sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!sidebarCollapsed}
          className="shrink-0 p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ToggleIcon className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Middle: breadcrumb — always flex-1 so right icons stay pinned to the right */}
        <div className="flex-1 min-w-0">
          {items.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500 overflow-hidden">
              {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 shrink-0">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />}
                  {item.href ? (
                    <Link href={item.href} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                      {i === 0 && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-800 font-medium">
                      {i === 0 && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Right: notification + profile — always pinned to the right */}
        <div className="shrink-0 flex items-center gap-1">
          <NotificationBell role={role} />
          <UserHeader email={email} role={role} name={name} />
        </div>
      </div>
    </header>
  );
}
