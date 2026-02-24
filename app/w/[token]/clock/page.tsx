"use client";

import { useState, useEffect, use, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  Play,
  Square,
  Pause,
  PlayCircle,
  MapPin,
  Users,
  Edit3,
} from "lucide-react";
import { addTimeEntry } from "@/lib/data";
import {
  useWorker,
  useWorkers,
  useJobsForWorker,
  useJobs,
  useTimeEntries,
} from "@/lib/hooks/useData";
import type { TimeEntryInput } from "@/lib/entities";
import {
  getActiveSession,
  saveSession,
  calculateSessionDuration,
  calculateSessionEarnings,
  calculateTodayTotals,
  calculateWeeklyTotals,
  isOvertimeToday,
  isOvertimeWeek,
  OT_MULTIPLIER,
  type Session,
} from "@/lib/workerClockUtils";
import { FormField, FormInput, FormTextarea } from "@/components/forms/FormField";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date) {
  const today = new Date();
  const d = new Date(date);
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function hoursFromEntry(start: string, end: string, breakMins: number): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const mins = (e - s) / (1000 * 60) - breakMins;
  return Math.max(0, mins) / 60;
}

export default function WorkerClockPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const searchParams = useSearchParams();
  const workerId = token;
  const jobIdFromUrl = searchParams.get("jobId") ?? undefined;

  const [ready, setReady] = useState(false);
  const [session, setSessionState] = useState<Session | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState("0:00:00");
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [breaks, setBreaks] = useState("0");
  const [notes, setNotes] = useState("");
  const { item: worker } = useWorker(workerId);
  const { items: workers } = useWorkers();
  const { items: jobsForWorker } = useJobsForWorker(workerId);
  const { items: allJobs } = useJobs();
  const { items: entries, refetch: refetchEntries } = useTimeEntries(workerId);

  const isClockedIn = session !== null && session.workerId === workerId;
  const clockInTime = useMemo(() => (session ? new Date(session.start) : null), [session]);
  const onBreak = Boolean(session?.breakStartedAt);
  const breakMins = session?.breakTotalMinutes ?? 0;
  const activeJob = isClockedIn && session
    ? allJobs.find((j) => j.id === session.jobId)
    : null;
  const selectedJob = selectedJobId
    ? allJobs.find((j) => j.id === selectedJobId)
    : null;

  const refreshEntries = useCallback(() => {
    refetchEntries();
  }, [refetchEntries]);

  useEffect(() => {
    const current = getActiveSession();
    if (current && current.workerId === workerId) {
      setSessionState(current);
    } else {
      setSessionState(null);
    }
    setSelectedJobId(jobIdFromUrl ?? jobsForWorker[0]?.id ?? "");
    setReady(true);
  }, [workerId, jobIdFromUrl, jobsForWorker]);

  useEffect(() => {
    if (!ready) return;
    const current = getActiveSession();
    if (current && current.workerId === workerId) setSessionState(current);
    else setSessionState(null);
    refreshEntries();
  }, [workerId, refreshEntries, ready]);

  // Live timer and session hours (for earnings)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!isClockedIn || !session) return;
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isClockedIn, session]);

  const currentBreakMins = (() => {
    if (!session?.breakStartedAt) return 0;
    const start = new Date(session.breakStartedAt).getTime();
    return Math.floor((now.getTime() - start) / (1000 * 60));
  })();

  const totalBreakMinsThisSession = breakMins + currentBreakMins;
  const sessionHours = isClockedIn && session
    ? calculateSessionDuration(session.start, null, totalBreakMinsThisSession)
    : 0;
  const todayFromEntries = calculateTodayTotals(entries, workerId, worker);
  const weekFromEntries = calculateWeeklyTotals(entries, workerId, worker);
  const sessionIsOT = isClockedIn && (isOvertimeToday(entries, workerId, sessionHours) || isOvertimeWeek(entries, workerId, sessionHours));
  const sessionEarnings = isClockedIn && worker
    ? calculateSessionEarnings(sessionHours, worker.hourlyRate, sessionIsOT)
    : 0;

  const todayHours = todayFromEntries.hours + (isClockedIn ? sessionHours : 0);
  const todayEarnings = todayFromEntries.earnings + (isClockedIn ? sessionEarnings : 0);
  const weekHours = weekFromEntries.hours + (isClockedIn ? sessionHours : 0);
  const weekEarnings = weekFromEntries.earnings + (isClockedIn ? sessionEarnings : 0);
  const weekIsOT = isOvertimeWeek(entries, workerId, isClockedIn ? sessionHours : 0);

  // Update elapsed time display every second when clocked in
  useEffect(() => {
    if (!isClockedIn || !clockInTime) {
      setElapsedTime("0:00:00");
      return;
    }
    const totalBreakMs = totalBreakMinsThisSession * 60 * 1000;
    const diff = now.getTime() - clockInTime.getTime() - totalBreakMs;
    const h = Math.max(0, Math.floor(diff / 3600000));
    const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
    const sec = Math.max(0, Math.floor((diff % 60000) / 1000));
    setElapsedTime(`${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`);
  }, [isClockedIn, clockInTime, now, totalBreakMinsThisSession]);

  const handleClockIn = () => {
    const jobId = selectedJobId || jobIdFromUrl || jobsForWorker[0]?.id;
    if (!jobId) return;
    const newSession: Session = {
      workerId,
      jobId,
      start: new Date().toISOString(),
    };
    setSessionState(newSession);
    saveSession(newSession);
    setShowCompleteForm(false);
  };

  const handleStartBreak = () => {
    if (!session || session.workerId !== workerId) return;
    const updated: Session = { ...session, breakStartedAt: new Date().toISOString() };
    setSessionState(updated);
    saveSession(updated);
  };

  const handleEndBreak = () => {
    if (!session || !session.breakStartedAt) return;
    const start = new Date(session.breakStartedAt).getTime();
    const mins = Math.floor((Date.now() - start) / (1000 * 60));
    const updated: Session = {
      ...session,
      breakTotalMinutes: (session.breakTotalMinutes ?? 0) + mins,
      breakStartedAt: undefined,
    };
    setSessionState(updated);
    saveSession(updated);
  };

  const handleClockOutClick = () => {
    if (onBreak) return;
    setShowCompleteForm(true);
    setBreaks(String(totalBreakMinsThisSession));
    setNotes("");
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    const breakMinsFinal = parseInt(breaks, 10) || session.breakTotalMinutes || 0;
    const end = new Date();
    const hours = calculateSessionDuration(session.start, end.toISOString(), breakMinsFinal);
    const wasOT = isOvertimeToday(entries, workerId, hours) || isOvertimeWeek(entries, workerId, hours);
    const input: TimeEntryInput = {
      workerId: session.workerId,
      jobId: session.jobId,
      start: session.start,
      end: end.toISOString(),
      breaks: breakMinsFinal,
      notes: notes.trim() || undefined,
      isOvertime: wasOT,
    };
    await addTimeEntry(input);
    setSessionState(null);
    saveSession(null);
    setShowCompleteForm(false);
    refreshEntries();
  };

  const handleCompleteCancel = () => setShowCompleteForm(false);

  const completedEntries = entries
    .filter((e) => e.end)
    .sort((a, b) => new Date(b.end!).getTime() - new Date(a.end!).getTime())
    .slice(0, 10);
  const rate = worker?.hourlyRate ?? 0;
  const otRate = Math.round(rate * OT_MULTIPLIER);

  // When clocked in, show current session at top of recent list as "In progress"
  const showCurrentSessionInList = isClockedIn && session && activeJob;

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-fc-brand">
            Clock in / out
          </h1>
          <p className="mt-1 text-sm text-fc-muted">
            Your shift control. Clock in on a job, take breaks, then clock out with notes.
          </p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-12 text-center">
          <Clock className="mx-auto h-10 w-10 text-fc-muted" />
          <p className="mt-3 text-sm text-fc-muted">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-fc-brand">
          Clock in / out
        </h1>
        <p className="mt-1 text-sm text-fc-muted">
          Your shift control. Clock in on a job, take breaks, then clock out with notes.
        </p>
      </div>

      <div className="mb-6 border border-fc-border bg-fc-surface p-8">
        <div className="text-center">
          {/* Clocked out */}
          {!isClockedIn && !showCompleteForm && (
            <>
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center border-2 border-fc-border bg-fc-surface-muted">
                  <Clock className="h-12 w-12 text-fc-muted" />
                </div>
                <h2 className="text-lg font-semibold text-fc-brand">Clocked out</h2>
              </div>

              {jobsForWorker.length > 0 && (
                <div className="mb-6 text-left">
                  <label htmlFor="clock-job" className="block text-xs font-bold uppercase tracking-widest text-fc-muted">
                    Job
                  </label>
                  <select
                    id="clock-job"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="mt-1 w-full border border-fc-border bg-fc-surface py-2 pl-3 pr-8 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                  >
                    <option value="">Select job…</option>
                    {jobsForWorker.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name} — {j.address}
                      </option>
                    ))}
                  </select>
                  {!selectedJobId && (
                    <p className="mt-1.5 text-xs text-fc-muted">
                      Select a job to start tracking time.
                    </p>
                  )}
                  {selectedJob && (
                    <div className="mt-3 border border-fc-border bg-fc-surface-muted p-3 text-left text-sm">
                      <p className="flex items-center gap-1.5 font-medium text-fc-brand">
                        <MapPin className="h-3.5 w-3.5" />
                        {selectedJob.address}
                      </p>
                      {(selectedJob.date || selectedJob.time) && (
                        <p className="mt-1 text-fc-muted">
                          {selectedJob.date && formatShortDate(selectedJob.date)}
                          {selectedJob.time && ` • ${selectedJob.time}`}
                        </p>
                      )}
                      {selectedJob.workerIds && selectedJob.workerIds.length > 0 && (
                        <p className="mt-1 flex items-center gap-1.5 text-fc-muted">
                          <Users className="h-3.5 w-3.5" />
                          {selectedJob.workerIds
                            .map((id) => workers.find((w) => w.id === id)?.name)
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleClockIn}
                disabled={!selectedJobId}
                className="inline-flex items-center justify-center gap-2 bg-fc-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-5 w-5" />
                Clock in
              </button>
            </>
          )}

          {/* Clocked in */}
          {isClockedIn && !showCompleteForm && (
            <>
              <div className="mb-6">
                <div className="mx-auto mb-2 flex h-20 items-center justify-center border-2 border-fc-border bg-fc-surface-muted">
                  <span className="font-mono text-3xl font-bold tabular-nums text-fc-brand">
                    {elapsedTime}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-fc-muted">Time elapsed</p>
                {worker && (
                  <p className="mt-1 text-lg font-bold text-fc-brand">
                    Session earnings: ${sessionEarnings.toFixed(2)}
                  </p>
                )}
                {sessionIsOT && (
                  <span className="mt-2 inline-block bg-fc-warning-bg px-2 py-0.5 text-xs font-semibold text-fc-warning">
                    Overtime rate active
                  </span>
                )}
              </div>

              {activeJob && (
                <div className="mb-6 border border-fc-border bg-fc-surface-muted p-4 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">
                    Current job
                  </p>
                  <p className="mt-1 font-semibold text-fc-brand">{activeJob.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-fc-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {activeJob.address}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                {onBreak ? (
                  <button
                    onClick={handleEndBreak}
                    className="inline-flex items-center justify-center gap-2 bg-fc-accent px-6 py-3 text-base font-semibold text-white hover:bg-fc-accent-dark"
                  >
                    <PlayCircle className="h-5 w-5" />
                    End break
                  </button>
                ) : (
                  <button
                    onClick={handleStartBreak}
                    className="inline-flex items-center justify-center gap-2 border border-fc-border bg-fc-surface px-6 py-3 text-base font-semibold text-fc-brand hover:bg-fc-surface-muted"
                  >
                    <Pause className="h-5 w-5" />
                    Start break
                  </button>
                )}
                <button
                  onClick={handleClockOutClick}
                  disabled={onBreak}
                  className="inline-flex items-center justify-center gap-2 bg-fc-danger-bg px-6 py-3 text-base font-semibold text-fc-danger border border-fc-danger focus:outline-none focus:ring-2 focus:ring-fc-danger focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Square className="h-5 w-5" />
                  Clock out
                </button>
              </div>
              {onBreak && (
                <p className="mt-2 text-xs text-fc-warning">
                  End break before clocking out.
                </p>
              )}
            </>
          )}

          {/* Clock out form */}
          {showCompleteForm && session && (
            <form
              onSubmit={handleCompleteSubmit}
              className="mx-auto max-w-sm space-y-4 border border-fc-border bg-fc-surface-muted p-6 text-left"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-fc-muted">
                Add breaks and notes for this session
              </p>
              <FormField label="Breaks (minutes)" id="complete-breaks">
                <FormInput
                  id="complete-breaks"
                  type="number"
                  min="0"
                  value={breaks}
                  onChange={(e) => setBreaks(e.target.value)}
                  placeholder="0"
                />
              </FormField>
              <FormField label="Notes" id="complete-notes">
                <FormTextarea
                  id="complete-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes about the job…"
                  rows={3}
                />
              </FormField>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-fc-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-fc-accent-dark"
                >
                  Save & clock out
                </button>
                <button
                  type="button"
                  onClick={handleCompleteCancel}
                  className="border border-fc-border bg-fc-surface px-4 py-2.5 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Today / This week / Hourly rate */}
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Summary
        </h2>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Today</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">{todayHours.toFixed(1)} hrs</p>
          <p className="text-xs text-fc-muted">${todayEarnings.toFixed(0)} earned</p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">This week</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">{weekHours.toFixed(1)} hrs</p>
          <p className="text-xs text-fc-muted">${weekEarnings.toFixed(0)} earned</p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Hourly rate</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">${rate}/hr</p>
          {weekIsOT && (
            <p className="text-xs text-fc-warning">OT rate: ${otRate}/hr</p>
          )}
        </div>
      </div>
      </section>

      {/* Recent sessions */}
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Recent sessions
        </h2>
      <div className="border border-fc-border bg-fc-surface p-5">
        {showCurrentSessionInList || completedEntries.length > 0 ? (
          <div className="space-y-3">
            {showCurrentSessionInList && (
              <div className="border-l-4 border-fc-accent bg-fc-surface-muted p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-fc-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-fc-brand truncate">{activeJob!.name}</p>
                      <p className="mt-0.5 text-xs text-fc-muted">
                        Today • Started {clockInTime && formatTime(clockInTime)}
                      </p>
                      {totalBreakMinsThisSession > 0 && (
                        <p className="mt-0.5 text-xs text-fc-muted">
                          Break: {totalBreakMinsThisSession} min
                        </p>
                      )}
                      <span className="mt-1 inline-block bg-fc-success-bg px-1.5 py-0.5 text-xs font-semibold text-fc-success">
                        In progress
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-fc-brand">{elapsedTime}</p>
                    <p className="text-xs text-fc-muted">${sessionEarnings.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            )}
            {completedEntries.map((e) => {
              const job = allJobs.find((j) => j.id === e.jobId);
              const start = new Date(e.start);
              const end = new Date(e.end!);
              const hrs = hoursFromEntry(e.start, e.end!, e.breaks ?? 0);
              const earnings = hrs * rate * (e.isOvertime ? OT_MULTIPLIER : 1);
              const incomplete = false;
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-4 border border-fc-border p-3 transition-colors hover:bg-fc-surface-muted"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-fc-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-fc-brand truncate">
                        {job?.name ?? "Unknown job"}
                      </p>
                      <p className="mt-0.5 text-xs text-fc-muted">
                        {formatDate(start)} • {formatTime(start)} – {formatTime(end)}
                      </p>
                      {(e.breaks ?? 0) > 0 && (
                        <p className="mt-0.5 text-xs text-fc-muted">
                          Break: {e.breaks} min
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {e.isOvertime && (
                          <span className="bg-fc-warning-bg px-1.5 py-0.5 text-xs font-semibold text-fc-warning">
                            OT
                          </span>
                        )}
                        {incomplete && (
                          <span className="bg-fc-danger-bg px-1.5 py-0.5 text-xs font-semibold text-fc-danger">
                            Incomplete session
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-fc-brand">{hrs.toFixed(1)} hrs</p>
                      <p className="text-xs text-fc-muted">${Math.round(earnings)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="p-1.5 text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                      aria-label="Edit session"
                      title="Edit (coming soon)"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-fc-muted" />
            <p className="mt-2 text-sm text-fc-muted">No recent sessions</p>
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
