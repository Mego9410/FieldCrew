"use client";

import { useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { FormField, FormInput } from "@/components/forms/FormField";
import { useToast } from "@/components/ui/Toast";
import { Monitor } from "lucide-react";

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return "At least 8 characters required";
  const hasNumber = /\d/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(pwd);
  if (!hasNumber && !hasSymbol) return "Include a number or symbol";
  return null;
}

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const toast = useToast();

  const isDirty =
    currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (currentPassword === "" && (newPassword || confirmPassword)) {
      e.current = "Current password is required";
    }
    if (newPassword) {
      const v = validatePassword(newPassword);
      if (v) e.new = v;
    }
    if (newPassword && confirmPassword !== newPassword) {
      e.confirm = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePasswordSave = async () => {
    if (!isDirty || !validate() || loading) return;
    if (!currentPassword || !newPassword || !confirmPassword) return;
    setLoading(true);
    try {
      // TODO: Call API to change password
      await new Promise((r) => setTimeout(r, 500));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      // TODO: Show 2FA setup modal (QR step) - stub for now
      toast.success("2FA setup would open here (stub)");
    }
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const recoveryCodes = [
    "abcd-1234-efgh",
    "5678-ijkl-mnop",
    "qrst-9012-uvwx",
    "yzab-3456-cdef",
    "ghij-7890-klmn",
  ];

  return (
    <SettingsPageShell
      title="Security"
      description="Password, two-factor authentication, and sessions."
    >
      <div className="space-y-6">
        <SettingsSectionCard
          title="Password"
          description="Change your account password."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordSave();
            }}
            className="space-y-4"
          >
            <FormField
              label="Current password"
              id="security-current-pwd"
              error={errors.current}
            >
              <FormInput
                id="security-current-pwd"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </FormField>
            <FormField
              label="New password"
              id="security-new-pwd"
              error={errors.new}
            >
              <FormInput
                id="security-new-pwd"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </FormField>
            <FormField
              label="Confirm new password"
              id="security-confirm-pwd"
              error={errors.confirm}
            >
              <FormInput
                id="security-confirm-pwd"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </FormField>
            <p className="text-xs text-fc-muted">
              Min 8 characters, include a number or symbol.
            </p>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!isDirty || loading}
                className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : "Update password"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={!isDirty}
                className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Two-factor authentication (2FA)"
          description="Add an extra layer of security."
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-fc-brand">
                  Enable 2FA
                </span>
                <p className="text-xs text-fc-muted mt-0.5">
                  Use an authenticator app to secure your account
                </p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleToggle2FA}
                className="h-5 w-9 shrink-0 rounded-full border border-fc-border bg-slate-100 accent-fc-accent focus:ring-fc-accent"
                role="switch"
                aria-checked={twoFactorEnabled}
              />
            </label>

            {twoFactorEnabled && (
              <div className="space-y-3 pt-2 border-t border-fc-border">
                <p className="text-sm text-fc-brand">
                  Authenticator app method configured (stub)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryCodes(true)}
                    className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
                  >
                    Show recovery codes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegenerateConfirm(true)}
                    className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
                  >
                    Regenerate recovery codes
                  </button>
                </div>
              </div>
            )}
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Active sessions"
          description="Manage devices where you are signed in."
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-fc-border p-4">
              <Monitor className="h-5 w-5 text-fc-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fc-brand">
                  Current device
                </p>
                <p className="text-xs text-fc-muted">Windows • Chrome</p>
              </div>
              <span className="text-xs text-fc-muted">Active now</span>
            </div>
            <button
              type="button"
              className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
            >
              Sign out other sessions
            </button>
          </div>
        </SettingsSectionCard>
      </div>

      {showRecoveryCodes && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recovery-codes-title"
        >
          <div className="w-full max-w-md rounded-lg border border-fc-border bg-white p-6 shadow-lg">
            <h2 id="recovery-codes-title" className="font-display text-lg font-bold text-fc-brand">
              Recovery codes
            </h2>
            <p className="mt-1 text-sm text-fc-muted mb-4">
              Save these codes in a secure place. Each can be used once.
            </p>
            <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm space-y-1">
              {recoveryCodes.map((code) => (
                <div key={code} className="text-fc-brand">
                  {code}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowRecoveryCodes(false)}
              className="mt-4 w-full rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showRegenerateConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="regenerate-title"
        >
          <div className="w-full max-w-md rounded-lg border border-fc-border bg-white p-6 shadow-lg">
            <h2 id="regenerate-title" className="font-display text-lg font-bold text-fc-brand">
              Regenerate recovery codes?
            </h2>
            <p className="mt-1 text-sm text-fc-muted mb-4">
              Old codes will stop working. You will get new codes.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowRegenerateConfirm(false);
                  toast.success("Recovery codes regenerated (stub)");
                }}
                className="flex-1 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(false)}
                className="flex-1 rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsPageShell>
  );
}
