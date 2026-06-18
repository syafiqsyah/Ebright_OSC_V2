"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  Plus,
  Key,
} from "lucide-react";
import { useBreadcrumb } from "@/app/components/BreadcrumbContext";

type EventStatus = "draft" | "open" | "ongoing" | "closed" | "completed";

interface FAEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: number;
  venue: string;
  status: EventStatus;
  sessions: number;
  invited: number;
  confirmed: number;
  attended?: number;
  month: string;
  day: number;
  year: number;
  archiveDate?: string;
  multiGrade?: boolean;
}

const mockActiveEvents: FAEvent[] = [
  {
    id: "1",
    name: "20-21 June Weekly Showcase",
    startDate: "20 Jun 2026",
    endDate: "21 Jun 2026",
    days: 2,
    venue: "KL Gateway",
    status: "closed",
    sessions: 14,
    invited: 268,
    confirmed: 240,
    month: "JUN",
    day: 20,
    year: 2026,
    multiGrade: true,
  },
  {
    id: "2",
    name: "18-19 July Weekly Showcase",
    startDate: "18 Jul 2026",
    endDate: "19 Jul 2026",
    days: 2,
    venue: "Pavilion Damansara Heights",
    status: "ongoing",
    sessions: 14,
    invited: 215,
    confirmed: 180,
    month: "JUL",
    day: 18,
    year: 2026,
    multiGrade: true,
  },
  {
    id: "3",
    name: "25-26 July Weekly Showcase",
    startDate: "25 Jul 2026",
    endDate: "26 Jul 2026",
    days: 2,
    venue: "NU Empire",
    status: "draft",
    sessions: 14,
    invited: 0,
    confirmed: 0,
    month: "JUL",
    day: 25,
    year: 2026,
  },
];

const mockArchiveEvents: FAEvent[] = [
  {
    id: "a1",
    name: "16-17 May Weekly Showcase",
    startDate: "16 May 2026",
    endDate: "17 May 2026",
    days: 2,
    venue: "Mid Valley",
    status: "completed",
    sessions: 14,
    invited: 249,
    confirmed: 191,
    attended: 190,
    month: "MAY",
    day: 16,
    year: 2026,
    archiveDate: "Jun 10, 2026",
  },
  {
    id: "a2",
    name: "30-31 May Weekly Showcase",
    startDate: "30 May 2026",
    endDate: "31 May 2026",
    days: 2,
    venue: "Sunway Pyramid",
    status: "completed",
    sessions: 14,
    invited: 190,
    confirmed: 146,
    attended: 146,
    month: "MAY",
    day: 30,
    year: 2026,
    archiveDate: "Jun 4, 2026",
  },
  {
    id: "a3",
    name: "FA MAY",
    startDate: "16 May 2026",
    endDate: "16 May 2026",
    days: 1,
    venue: "HQ",
    status: "completed",
    sessions: 10,
    invited: 0,
    confirmed: 0,
    attended: 0,
    month: "MAY",
    day: 16,
    year: 2026,
    archiveDate: "May 16, 2026",
  },
  {
    id: "a4",
    name: "test",
    startDate: "8 May 2026",
    endDate: "8 May 2026",
    days: 1,
    venue: "HQ",
    status: "completed",
    sessions: 10,
    invited: 2,
    confirmed: 0,
    attended: 0,
    month: "MAY",
    day: 8,
    year: 2026,
    archiveDate: "May 8, 2026",
  },
  {
    id: "a5",
    name: "Historical FA (pre-portal records)",
    startDate: "1 Jan 2025",
    endDate: "1 Jan 2025",
    days: 1,
    venue: "—",
    status: "completed",
    sessions: 1,
    invited: 710,
    confirmed: 710,
    attended: 710,
    month: "JAN",
    day: 1,
    year: 2025,
    archiveDate: "Jan 1, 2025",
  },
];

const STATUS_FILTERS: { label: string; value: EventStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Closed", value: "closed" },
  { label: "Completed", value: "completed" },
];

const STATUS_STYLES: Record<EventStatus, { dot: string; text: string; bg: string }> = {
  draft:     { dot: "bg-slate-400",  text: "text-slate-600",  bg: "bg-slate-100"  },
  open:      { dot: "bg-blue-500",   text: "text-blue-700",   bg: "bg-blue-50"    },
  ongoing:   { dot: "bg-teal-500",   text: "text-teal-700",   bg: "bg-teal-50"    },
  closed:    { dot: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50"   },
  completed: { dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50"   },
};

function StatusBadge({ status }: { status: EventStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function EventCard({ event, featured = false }: { event: FAEvent; featured?: boolean }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 flex gap-5 items-center hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer ${featured ? "shadow-sm" : ""}`}>
      <div className="flex flex-col items-center justify-center min-w-[56px] text-center">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
          {event.month}
        </span>
        <span className={`font-bold leading-none mt-0.5 ${featured ? "text-5xl text-slate-900" : "text-3xl text-slate-800"}`}>
          {event.day}
        </span>
        <span className="text-xs text-slate-400 mt-0.5">{event.year}</span>
      </div>

      <div className="w-px h-full self-stretch bg-slate-200 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <StatusBadge status={event.status} />
            {event.multiGrade && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                <Key className="w-3 h-3" />
                Multi-grade
              </span>
            )}
          </div>
        </div>
        <h3 className={`font-semibold text-slate-900 mt-2 ${featured ? "text-xl" : "text-base"}`}>
          {event.name}
        </h3>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            {event.startDate === event.endDate
              ? event.startDate
              : `${event.startDate} – ${event.endDate}`} · {event.days} {event.days === 1 ? "day" : "days"}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.venue}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6 shrink-0">
        <Stat label="Sessions" value={event.sessions} />
        <div className="w-px h-8 bg-slate-200" />
        <Stat label="Invited" value={event.invited} />
        <div className="w-px h-8 bg-slate-200" />
        <Stat label="Confirmed" value={event.confirmed} highlight={event.confirmed > 0} />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold leading-none ${highlight ? "text-green-600" : "text-slate-800"}`}>
        {value}
      </div>
      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  );
}

function ArchiveRow({ event }: { event: FAEvent }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group rounded-xl">
      <span className="text-sm text-slate-400 w-28 shrink-0">{event.archiveDate}</span>

      <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">
        {event.name}
      </span>

      <div className="hidden sm:flex items-center gap-5 shrink-0">
        <StatusBadge status={event.status} />
        <span className="text-sm text-slate-500 w-20 text-right">{event.sessions} sessions</span>
        <span className="text-sm text-slate-500 w-20 text-right">{event.invited} invited</span>
        <span className={`text-sm font-medium w-24 text-right ${event.confirmed > 0 ? "text-green-600" : "text-slate-400"}`}>
          {event.confirmed} confirmed
        </span>
        <span className={`text-sm font-medium w-22 text-right ${(event.attended ?? 0) > 0 ? "text-violet-600" : "text-slate-400"}`}>
          {event.attended ?? 0} attended
        </span>
      </div>
    </div>
  );
}

export default function FAEventsClient() {
  useBreadcrumb([
    { label: "Home", href: "/home" },
    { label: "FA System", href: "/dashboards/fa" },
    { label: "Events" },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");

  const q = search.toLowerCase();

  const matchesSearch = (e: FAEvent) =>
    !search || e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);

  const filteredActive = mockActiveEvents.filter((e) => {
    if (!matchesSearch(e)) return false;
    if (statusFilter === "completed") return false;
    if (statusFilter === "all") return true;
    return e.status === statusFilter;
  });

  // Archive always shows completed; if filter is set to a non-completed status, hide archive
  const showArchive = statusFilter === "all" || statusFilter === "completed";
  const filteredArchive = showArchive
    ? mockArchiveEvents.filter(matchesSearch)
    : [];

  const multiGradeCount = mockActiveEvents.filter((e) => e.multiGrade).length;
  const [nextEvent, ...upcoming] = filteredActive;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-0">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">FA Events</h1>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New event
          </button>
        </div>
      </div>

      {/* Sticky search + filters bar */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events or venues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === f.value
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {multiGradeCount > 0 && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wide shrink-0"
            >
              <Key className="w-3.5 h-3.5" />
              Multi-grade
              <span className="ml-0.5 bg-slate-900 text-white rounded-full px-1.5 py-0.5 text-[10px] leading-none">
                {multiGradeCount}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-10">
        {/* Active events list */}
        {statusFilter !== "completed" && (
          <>
            {filteredActive.length === 0 && statusFilter !== "all" ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center">
                <CalendarDays className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">No events match your filters.</p>
              </div>
            ) : (
              <>
                {nextEvent && (
                  <>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Next Event
                    </p>
                    <EventCard event={nextEvent} featured />
                  </>
                )}

                {upcoming.length > 0 && (
                  <>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-8 mb-3">
                      Also Upcoming
                    </p>
                    <div className="space-y-3">
                      {upcoming.map((e) => (
                        <EventCard key={e.id} event={e} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Archive section */}
        {filteredArchive.length > 0 && (
          <div className={statusFilter !== "completed" ? "mt-12" : ""}>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Archive
            </p>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {filteredArchive.map((e) => (
                <ArchiveRow key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state when completed filter + no archive results */}
        {statusFilter === "completed" && filteredArchive.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No completed events match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
