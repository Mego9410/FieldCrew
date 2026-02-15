"use client";

import { useEffect, useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
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

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    getDefaultNotifications()
  );
  const [saved, setSaved] = useState<NotificationPrefs>(prefs);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getSettings().then((s) => {
      setPrefs(s.notifications);
      setSaved(s.notifications);
    });
  }, []);

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(saved);

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

  const handleCancel = () => {
    setPrefs(saved);
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
