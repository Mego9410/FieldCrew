"use client";

import { useEffect, useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { FormField, FormSelect } from "@/components/forms/FormField";
import { useToast } from "@/components/ui/Toast";
import {
  getSettings,
  saveSettings,
  getDefaultNotifications,
  type NotificationPrefs,
} from "@/lib/settings.mock";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer">
      <div>
        <span className="text-sm font-medium text-fc-brand">{label}</span>
        {description && (
          <p className="text-xs text-fc-muted mt-0.5">{description}</p>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-9 shrink-0 rounded-full border border-fc-border bg-slate-100 accent-fc-accent focus:ring-fc-accent"
        role="switch"
        aria-checked={checked}
      />
    </label>
  );
}

const JOB_REMINDER_HOURS_OPTIONS = [
  { value: 0, label: "Off" },
  { value: 1, label: "1 hour before" },
  { value: 2, label: "2 hours before" },
  { value: 4, label: "4 hours before" },
  { value: 8, label: "8 hours before" },
  { value: 24, label: "24 hours before" },
];

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    getDefaultNotifications()
  );
  const [saved, setSaved] = useState<NotificationPrefs>(prefs);
  const [loading, setLoading] = useState(false);
  const [jobReminderHours, setJobReminderHours] = useState<number>(0);
  const [jobReminderSaved, setJobReminderSaved] = useState<number>(0);
  const [jobReminderLoading, setJobReminderLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getSettings().then((s) => {
      setPrefs(s.notifications);
      setSaved(s.notifications);
    });
  }, []);

  useEffect(() => {
    fetch("/api/settings/job-reminder")
      .then((r) => r.json())
      .then((d) => {
        const h = typeof d.jobReminderHours === "number" ? d.jobReminderHours : 0;
        setJobReminderHours(h);
        setJobReminderSaved(h);
      })
      .catch(() => {});
  }, []);

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(saved);
  const jobReminderDirty = jobReminderHours !== jobReminderSaved;

  const update = (k: keyof NotificationPrefs, v: boolean) => {
    setPrefs((p) => ({ ...p, [k]: v }));
  };

  const handleSave = async () => {
    if (!isDirty || loading) return;
    setLoading(true);
    try {
      await saveSettings({ notifications: prefs });
      setSaved(prefs);
      toast.success("Notification preferences saved");
    } catch {
      toast.error("Failed to save notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleJobReminderSave = async () => {
    if (!jobReminderDirty || jobReminderLoading) return;
    setJobReminderLoading(true);
    try {
      const res = await fetch("/api/settings/job-reminder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobReminderHours }),
      });
      if (!res.ok) throw new Error(await res.text());
      const d = await res.json();
      setJobReminderSaved(d.jobReminderHours ?? jobReminderHours);
      toast.success("Job reminder setting saved");
    } catch {
      toast.error("Failed to save job reminder setting");
    } finally {
      setJobReminderLoading(false);
    }
  };

  const handleCancel = () => {
    setPrefs(saved);
  };

  const handleJobReminderCancel = () => {
    setJobReminderHours(jobReminderSaved);
  };

  const handleResetDefaults = () => {
    const defaults = getDefaultNotifications();
    setPrefs(defaults);
    toast.success("Reset to defaults (save to apply)");
  };

  return (
    <SettingsPageShell
      title="Notifications"
      description="Email and in-app notification preferences."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <SettingsSectionCard
          title="Admin / Owner alerts"
          description="Alerts for labour summaries, overtime, and timesheets."
        >
          <div className="divide-y divide-fc-border">
            <ToggleRow
              label="Weekly labour summary"
              description="Email summary of labour hours"
              checked={prefs.weeklyLabourSummaryEmail}
              onChange={(v) => update("weeklyLabourSummaryEmail", v)}
            />
            <ToggleRow
              label="Overtime threshold exceeded"
              description="Email and in-app when overtime threshold is exceeded"
              checked={prefs.overtimeThresholdEmail || prefs.overtimeThresholdInApp}
              onChange={(v) => {
                update("overtimeThresholdEmail", v);
                update("overtimeThresholdInApp", v);
              }}
            />
            <ToggleRow
              label="Job over budget alert"
              description="In-app when a job exceeds budget"
              checked={prefs.jobOverBudgetInApp}
              onChange={(v) => update("jobOverBudgetInApp", v)}
            />
            <ToggleRow
              label="Unapproved timesheets reminder"
              description="Email reminder for pending approvals"
              checked={prefs.unapprovedTimesheetsEmail}
              onChange={(v) => update("unapprovedTimesheetsEmail", v)}
            />
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Worker notifications"
          description="Notifications for workers."
        >
          <div className="divide-y divide-fc-border">
            <ToggleRow
              label="Clock-in reminder"
              description="In-app reminder to clock in"
              checked={prefs.clockInReminderInApp}
              onChange={(v) => update("clockInReminderInApp", v)}
            />
            <ToggleRow
              label="Break reminder"
              description="In-app reminder to take breaks"
              checked={prefs.breakReminderInApp}
              onChange={(v) => update("breakReminderInApp", v)}
            />
            <ToggleRow
              label="Shift edited by manager"
              description="Email when a manager edits your shift"
              checked={prefs.shiftEditedEmail}
              onChange={(v) => update("shiftEditedEmail", v)}
            />
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Worker SMS"
          description="Send job reminder SMS to workers with a direct link to the job and clock-in page."
        >
          <div className="space-y-4">
            <FormField label="Send job reminder SMS" id="job-reminder-hours">
              <p className="text-xs text-fc-muted mt-0.5 mb-1">
                Hours before each job start to send an SMS with a link to the job and clock-in.
              </p>
              <FormSelect
                id="job-reminder-hours"
                value={String(jobReminderHours)}
                onChange={(e) => setJobReminderHours(Number(e.target.value))}
              >
                {JOB_REMINDER_HOURS_OPTIONS.map((o) => (
                  <option key={o.value} value={String(o.value)}>
                    {o.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleJobReminderSave}
                disabled={!jobReminderDirty || jobReminderLoading}
                className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {jobReminderLoading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleJobReminderCancel}
                disabled={!jobReminderDirty}
                className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </SettingsSectionCard>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!isDirty || loading}
            className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty}
            className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
          >
            Reset to defaults
          </button>
        </div>
      </form>
    </SettingsPageShell>
  );
}
