"use client";

import { useRef } from "react";
import { User } from "lucide-react";

interface AvatarUploaderProps {
  avatarUrl: string | null;
  onUpload: (url: string | null) => void;
  disabled?: boolean;
}

export function AvatarUploader({
  avatarUrl,
  onUpload,
  disabled = false,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (disabled) return;
    // Mock upload: simulate file pick and set a placeholder data URL
    // TODO: Replace with real file upload when API is ready
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mock: create object URL for preview
    const url = URL.createObjectURL(file);
    onUpload(url);
    e.target.value = "";
  };

  const handleRemove = () => {
    if (avatarUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarUrl);
    }
    onUpload(null);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-fc-border bg-slate-100">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob URLs for user upload preview
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-10 w-10 text-fc-muted" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload profile photo"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={disabled}
          className="rounded-lg border border-fc-border px-3 py-1.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
        >
          Upload
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled || !avatarUrl}
          className="rounded-lg border border-fc-border px-3 py-1.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
