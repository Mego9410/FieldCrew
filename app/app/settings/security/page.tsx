"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { FormField, FormInput } from "@/components/forms/FormField";
import { useToast } from "@/components/ui/Toast";
import { Monitor } from "lucide-react";
import { routes } from "@/lib/routes";
import QRCode from "qrcode";

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return "At least 8 characters required";
  const hasNumber = /\d/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(pwd);
  if (!hasNumber && !hasSymbol) return "Include a number or symbol";
  return null;
}

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const toast = useToast();
  const [userEmail, setUserEmail] = useState<string>("");
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [setupSecret, setSetupSecret] = useState<string>("");
  const [setupCode, setSetupCode] = useState<string>("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

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
      const res = await fetch("/api/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error(await res.text());
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
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
      return;
    }
    setTwoFactorEnabled(true);
  };

  useEffect(() => {
    fetch("/api/security/2fa/status")
      .then((r) => r.json())
      .then((d: { enabled?: boolean; email?: string }) => {
        setTwoFactorEnabled(Boolean(d.enabled));
        setUserEmail(d.email ?? "");
      })
      .catch(() => {});
  }, []);

  const handleStart2FA = async () => {
    if (twoFactorLoading) return;
    setTwoFactorLoading(true);
    try {
      const res = await fetch("/api/security/2fa/start", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const d = (await res.json()) as { otpauthUrl: string; secret: string };
      setSetupSecret(d.secret);
      const url = await QRCode.toDataURL(d.otpauthUrl);
      setQrDataUrl(url);
      toast.success("Scan the QR code, then enter a code to verify.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start 2FA");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    const code = setupCode.trim();
    if (!code || twoFactorLoading) return;
    setTwoFactorLoading(true);
    try {
      const res = await fetch("/api/security/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((d as { error?: string }).error ?? "Failed to verify 2FA");
      setRecoveryCodes(Array.isArray((d as { recoveryCodes?: unknown }).recoveryCodes) ? (d as { recoveryCodes: string[] }).recoveryCodes : []);
      setShowRecoveryCodes(true);
      setQrDataUrl("");
      setSetupSecret("");
      setSetupCode("");
      toast.success("2FA enabled");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    const code = setupCode.trim();
    if (!code || twoFactorLoading) return;
    setTwoFactorLoading(true);
    try {
      const res = await fetch("/api/security/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error(await res.text());
      setTwoFactorEnabled(false);
      setSetupCode("");
      toast.success("2FA disabled");
      router.refresh();
    } catch {
      toast.error("Failed to disable 2FA");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleRegenerateRecoveryCodes = async () => {
    const code = setupCode.trim();
    if (!code || twoFactorLoading) return;
    setTwoFactorLoading(true);
    try {
      const res = await fetch("/api/security/2fa/recovery-codes/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((d as { error?: string }).error ?? "Failed to regenerate");
      setRecoveryCodes(Array.isArray((d as { recoveryCodes?: unknown }).recoveryCodes) ? (d as { recoveryCodes: string[] }).recoveryCodes : []);
      setShowRegenerateConfirm(false);
      setShowRecoveryCodes(true);
      toast.success("Recovery codes regenerated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to regenerate recovery codes");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userEmail || deleteConfirmEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase()) {
      toast.error("Type your email to confirm");
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirmEmail: deleteConfirmEmail.trim() }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        toast.error(json.error ?? "Failed to delete account");
        return;
      }

      // Sign out locally and redirect to login.
      window.location.assign(routes.public.login);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

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
                {!qrDataUrl ? (
                  <button
                    type="button"
                    onClick={handleStart2FA}
                    disabled={twoFactorLoading}
                    className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
                  >
                    {twoFactorLoading ? "Starting…" : "Set up authenticator app"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-fc-border bg-white p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element -- data url from QRCode */}
                      <img src={qrDataUrl} alt="2FA QR code" className="mx-auto h-44 w-44" />
                      <p className="mt-3 text-xs text-fc-muted text-center">
                        Or enter secret: <span className="font-mono text-fc-brand">{setupSecret}</span>
                      </p>
                    </div>
                    <FormField label="Enter a code to verify" id="twofa-verify-code">
                      <FormInput
                        id="twofa-verify-code"
                        value={setupCode}
                        onChange={(e) => setSetupCode(e.target.value)}
                        placeholder="123456"
                        autoComplete="one-time-code"
                      />
                    </FormField>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerify2FA}
                        disabled={twoFactorLoading || !setupCode.trim()}
                        className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {twoFactorLoading ? "Verifying…" : "Verify & enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQrDataUrl("");
                          setSetupSecret("");
                          setSetupCode("");
                        }}
                        disabled={twoFactorLoading}
                        className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <FormField label="Authenticator code (required for disable/regenerate)" id="twofa-action-code">
                  <FormInput
                    id="twofa-action-code"
                    value={setupCode}
                    onChange={(e) => setSetupCode(e.target.value)}
                    placeholder="123456"
                    autoComplete="one-time-code"
                  />
                </FormField>

                <div className="flex flex-wrap gap-2">
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
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    disabled={twoFactorLoading || !setupCode.trim()}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-900 hover:bg-red-100 disabled:opacity-50"
                    title="Enter a code above, then disable"
                  >
                    Disable 2FA
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

        <SettingsSectionCard
          title="Delete account"
          description="Permanently disable your account and stop access to your workspace."
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">
                This will delete your FieldCrew account access.
              </p>
              <p className="mt-1 text-xs text-red-800">
                For safety, this is a soft-delete (account is disabled) and can be restored by support if needed.
              </p>
            </div>

            <FormField
              label="Type your email to confirm"
              id="delete-confirm-email"
            >
              <FormInput
                id="delete-confirm-email"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder={userEmail || "you@company.com"}
                autoComplete="email"
              />
            </FormField>

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={
                deleteLoading ||
                !userEmail ||
                deleteConfirmEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase()
              }
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteLoading ? "Deleting…" : "Delete account"}
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
              {(recoveryCodes.length ? recoveryCodes : ["(Generate codes by enabling 2FA or regenerating)"]).map((code) => (
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
                }}
                className="flex-1 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateRecoveryCodes}
                disabled={twoFactorLoading || !setupCode.trim()}
                className="flex-1 rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
              >
                {twoFactorLoading ? "Working…" : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsPageShell>
  );
}
