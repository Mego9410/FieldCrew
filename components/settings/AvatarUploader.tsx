"use client";

import { useRef, useState } from "react";
import { User } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

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
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (disabled) return;
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (disabled || uploading) return;

    const previewUrl = URL.createObjectURL(file);
    onUpload(previewUrl);
    e.target.value = "";

    setUploading(true);
    fetch("/api/storage/avatar-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type || "image/png" }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return (await r.json()) as { signedUrl: string; publicUrl: string };
      })
      .then(async ({ signedUrl, publicUrl }) => {
        const put = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "image/png" },
          body: file,
        });
        if (!put.ok) throw new Error("Upload failed");
        URL.revokeObjectURL(previewUrl);
        onUpload(publicUrl);
        toast.success("Photo uploaded (save to apply)");
      })
      .catch(() => {
        toast.error("Failed to upload photo");
        // Keep preview so user sees what they selected.
      })
      .finally(() => {
        setUploading(false);
      });
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
          disabled={disabled || uploading}
          className="rounded-lg border border-fc-border px-3 py-1.5 text-sm font-medium text-fc-brand hover:bg-slate-50 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
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
