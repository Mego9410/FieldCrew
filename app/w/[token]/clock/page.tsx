"use client";

import { useState, use, useEffect } from "react";
import { Clock, Play, Square, Calendar, Clock3, MapPin, DollarSign } from "lucide-react";

// Mock data — comprehensive clock page data
const todayHours = 6.5;
const weekHours = 38;
const monthHours = 152;
const activeJob = {
  id: "1",
  name: "Smith HVAC Install",
  location: "123 Main St, City",
};

const recentSessions = [
  { id: "1", job: "Smith HVAC Install", date: "Today", startTime: "8:00 AM", endTime: "12:30 PM", duration: "4.5 hrs", earnings: "$180" },
  { id: "2", job: "Jones Furnace Repair", date: "Feb 12", startTime: "9:00 AM", endTime: "12:00 PM", duration: "3 hrs", earnings: "$120" },
  { id: "3", job: "Anderson Heat Pump Service", date: "Feb 11", startTime: "10:00 AM", endTime: "1:00 PM", duration: "3 hrs", earnings: "$120" },
  { id: "4", job: "Davis Thermostat Install", date: "Feb 10", startTime: "2:00 PM", endTime: "3:00 PM", duration: "1 hr", earnings: "$40" },
  { id: "5", job: "White Filter Replacement", date: "Feb 9", startTime: "11:00 AM", endTime: "11:30 AM", duration: "0.5 hrs", earnings: "$20" },
];

export default function WorkerClockPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  use(params); // token available for future worker auth
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("0:00");

  // Update elapsed time every second when clocked in
  useEffect(() => {
    if (!isClockedIn || !clockInTime) {
      setElapsedTime("0:00");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - clockInTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setElapsedTime(`${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  const handleClockIn = () => {
    setIsClockedIn(true);
    setClockInTime(new Date());
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
    setElapsedTime("0:00");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-fc-brand">Clock in / out</h1>
        <p className="mt-1 text-sm text-fc-muted">
          Record your work hours and track your time.
        </p>
      </div>

      {/* Main clock card */}
      <div className="mb-6 rounded-lg border border-fc-border bg-white p-8 shadow-sm">
        <div className="text-center">
          {/* Clock status */}
          <div className="mb-6">
            <div
              className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
                isClockedIn ? "bg-emerald-100" : "bg-slate-100"
              }`}
            >
              <Clock
                className={`h-12 w-12 ${
                  isClockedIn ? "text-emerald-700" : "text-slate-500"
                }`}
              />
            </div>
            <h2 className="text-lg font-semibold text-fc-brand">
              {isClockedIn ? "Clocked in" : "Clocked out"}
            </h2>
            {isClockedIn && clockInTime && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-fc-muted">
                  Started at {formatTime(clockInTime)}
                </p>
                <p className="text-2xl font-bold text-fc-brand font-mono">
                  {elapsedTime}
                </p>
                <p className="text-xs text-fc-muted">Time elapsed</p>
              </div>
            )}
          </div>

          {/* Active job info */}
          {activeJob && (
            <div className="mb-6 rounded-lg border border-fc-border bg-slate-50 p-4 text-left">
              <p className="text-xs font-medium text-fc-muted uppercase tracking-wide">
                Current job
              </p>
              <p className="mt-1 font-semibold text-fc-brand">{activeJob.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-fc-muted">
                <MapPin className="h-3.5 w-3.5" />
                {activeJob.location}
              </p>
            </div>
          )}

          {/* Clock buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!isClockedIn ? (
              <button
                onClick={handleClockIn}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <Play className="h-5 w-5" />
                Clock in
              </button>
            ) : (
              <button
                onClick={handleClockOut}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Square className="h-5 w-5" />
                Clock out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Clock3 className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">Today</p>
              <p className="text-2xl font-bold text-fc-brand">{todayHours} hrs</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Calendar className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">This week</p>
              <p className="text-2xl font-bold text-fc-brand">{weekHours} hrs</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">This month</p>
              <p className="text-2xl font-bold text-fc-brand">{monthHours} hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-fc-brand">Recent sessions</h2>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-fc-border p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fc-accent/10">
                    <Clock className="h-5 w-5 text-fc-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-fc-brand truncate">{session.job}</p>
                    <p className="mt-0.5 text-xs text-fc-muted">
                      {session.date} • {session.startTime} - {session.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-right">
                  <div>
                    <p className="text-sm font-medium text-fc-brand">{session.duration}</p>
                    <p className="text-xs text-fc-muted">{session.earnings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="mx-auto h-8 w-8 text-fc-muted" />
            <p className="mt-2 text-sm text-fc-muted">No recent sessions</p>
          </div>
        )}
      </div>
    </div>
  );
}
