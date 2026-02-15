/**
 * Worker clock in/out utilities: session, duration, earnings, today/week totals, overtime.
 * Uses TimeEntry start/end. Handles null end for incomplete/live session.
 */

import type { TimeEntry, Worker } from "./entities";

const OT_MULTIPLIER = 1.5;
const OT_DAILY_HOURS = 8;
const OT_WEEKLY_HOURS = 40;

export const WORKER_SESSION_KEY = "fc_worker_session";

export type Session = {
  workerId: string;
  jobId: string;
  start: string;
  breakTotalMinutes?: number;
  breakStartedAt?: string;
};

export function getActiveSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WORKER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(WORKER_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(WORKER_SESSION_KEY);
  }
}

/** Duration in hours. end=null means "now" for live session. */
export function calculateSessionDuration(
  start: string,
  end: string | null,
  breakMinutes: number
): number {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const mins = (e - s) / (1000 * 60) - breakMinutes;
  return Math.max(0, mins) / 60;
}

/** Earnings: hours * rate * (1.5 if OT). */
export function calculateSessionEarnings(
  hours: number,
  hourlyRate: number,
  isOvertime: boolean
): number {
  const mult = isOvertime ? OT_MULTIPLIER : 1;
  return hours * hourlyRate * mult;
}

function hoursFromEntry(entry: TimeEntry): number {
  if (!entry.end) return 0;
  const s = new Date(entry.start).getTime();
  const e = new Date(entry.end).getTime();
  return (e - s) / 3600000 - (entry.breaks ?? 0) / 60;
}

function getWeekStart(d: Date): Date {
  const x = new Date(d);
  x.setDate(d.getDate() - d.getDay());
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Today's total hours from completed entries only (worker's entries with end on today). */
export function getTodayHoursFromEntries(
  entries: TimeEntry[],
  workerId: string
): number {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return entries
    .filter((e) => e.workerId === workerId && e.end)
    .reduce((sum, e) => {
      const end = new Date(e.end);
      if (end < todayStart) return sum;
      const start = new Date(e.start);
      const s = start < todayStart ? todayStart.getTime() : start.getTime();
      const hrs = (end.getTime() - s) / 3600000 - (e.breaks ?? 0) / 60;
      return sum + Math.max(0, hrs);
    }, 0);
}

/** This week's total hours from completed entries only. */
export function getWeekHoursFromEntries(
  entries: TimeEntry[],
  workerId: string
): number {
  const weekStart = getWeekStart(new Date());
  return entries
    .filter((e) => e.workerId === workerId && e.end && new Date(e.end) >= weekStart)
    .reduce((sum, e) => sum + hoursFromEntry(e), 0);
}

/** Today's earnings from completed entries (with OT from entry.isOvertime). */
export function calculateTodayTotals(
  entries: TimeEntry[],
  workerId: string,
  worker: Worker | null
): { hours: number; earnings: number } {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let hours = 0;
  let earnings = 0;
  const rate = worker?.hourlyRate ?? 0;
  entries
    .filter((e) => e.workerId === workerId && e.end && new Date(e.end) >= todayStart)
    .forEach((e) => {
      const h = hoursFromEntry(e);
      hours += h;
      earnings += h * rate * (e.isOvertime ? OT_MULTIPLIER : 1);
    });
  return { hours, earnings };
}

/** This week's earnings from completed entries. */
export function calculateWeeklyTotals(
  entries: TimeEntry[],
  workerId: string,
  worker: Worker | null
): { hours: number; earnings: number } {
  const weekStart = getWeekStart(new Date());
  let hours = 0;
  let earnings = 0;
  const rate = worker?.hourlyRate ?? 0;
  entries
    .filter((e) => e.workerId === workerId && e.end && new Date(e.end) >= weekStart)
    .forEach((e) => {
      const h = hoursFromEntry(e);
      hours += h;
      earnings += h * rate * (e.isOvertime ? OT_MULTIPLIER : 1);
    });
  return { hours, earnings };
}

/** True if today's hours (including currentSessionHours) exceed 8. */
export function isOvertimeToday(
  entries: TimeEntry[],
  workerId: string,
  currentSessionHours: number
): boolean {
  const fromEntries = getTodayHoursFromEntries(entries, workerId);
  return fromEntries + currentSessionHours > OT_DAILY_HOURS;
}

/** True if week's hours (including currentSessionHours) exceed 40. */
export function isOvertimeWeek(
  entries: TimeEntry[],
  workerId: string,
  currentSessionHours: number
): boolean {
  const fromEntries = getWeekHoursFromEntries(entries, workerId);
  return fromEntries + currentSessionHours > OT_WEEKLY_HOURS;
}

export { OT_MULTIPLIER, OT_DAILY_HOURS, OT_WEEKLY_HOURS };
