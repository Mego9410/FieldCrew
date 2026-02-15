"use client";

import { useEffect, useState } from "react";
import { SettingsPageShell } from "@/components/settings/SettingsPageShell";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { AvatarUploader } from "@/components/settings/AvatarUploader";
import { FormField, FormInput, FormSelect } from "@/components/forms/FormField";
import { useToast } from "@/components/ui/Toast";
import { getSettings, saveSettings, type ProfileSettings } from "@/lib/settings.mock";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "UTC",
];

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileSettings>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timezone: "America/New_York",
    avatarUrl: null,
  });
  const [saved, setSaved] = useState<ProfileSettings>(profile);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  useEffect(() => {
    getSettings().then((s) => {
      setProfile(s.profile);
      setSaved(s.profile);
    });
  }, []);

  const isDirty =
    JSON.stringify(profile) !== JSON.stringify(saved);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!profile.firstName.trim()) e.firstName = "First name is required";
    if (!profile.lastName.trim()) e.lastName = "Last name is required";
    if (!profile.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      e.email = "Enter a valid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !isDirty || loading) return;
    setLoading(true);
    try {
      await saveSettings({ profile });
      setSaved(profile);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(saved);
    setErrors({});
  };

  return (
    <SettingsPageShell
      title="Profile"
      description="Update your name, email, and profile photo."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <SettingsSectionCard title="Personal information">
          <div className="space-y-4">
            <FormField
              label="First name"
              id="profile-first-name"
              required
              error={errors.firstName}
            >
              <FormInput
                id="profile-first-name"
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, firstName: e.target.value }))
                }
                placeholder="John"
                autoComplete="given-name"
              />
            </FormField>
            <FormField
              label="Last name"
              id="profile-last-name"
              required
              error={errors.lastName}
            >
              <FormInput
                id="profile-last-name"
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, lastName: e.target.value }))
                }
                placeholder="Doe"
                autoComplete="family-name"
              />
            </FormField>
            <FormField label="Email" id="profile-email" required error={errors.email}>
              <FormInput
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>
            <FormField label="Phone" id="profile-phone">
              <FormInput
                id="profile-phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="(555) 000-0000"
                autoComplete="tel"
              />
            </FormField>
            <FormField label="Timezone" id="profile-timezone">
              <FormSelect
                id="profile-timezone"
                value={profile.timezone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, timezone: e.target.value }))
                }
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </FormSelect>
            </FormField>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Profile photo"
          description="Upload a photo for your profile."
        >
          <AvatarUploader
            avatarUrl={profile.avatarUrl}
            onUpload={(url) => setProfile((p) => ({ ...p, avatarUrl: url }))}
          />
        </SettingsSectionCard>

        <div className="flex gap-2">
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
        </div>
      </form>
    </SettingsPageShell>
  );
}
