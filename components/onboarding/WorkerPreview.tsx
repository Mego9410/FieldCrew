"use client";

import { Card } from "@/components/ui/Card";
import { Smartphone, Clock, FileText, Camera, LogOut } from "lucide-react";

export function WorkerPreview() {
  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-12">
      <div className="relative">
        <div className="rounded-[2rem] border-4 border-fc-brand/20 bg-fc-brand p-2 shadow-xl">
          <div className="h-[420px] w-[220px] overflow-hidden rounded-[1.5rem] bg-fc-surface">
            <div className="flex h-full flex-col bg-fc-surface-muted">
              <div className="flex items-center justify-center gap-2 border-b border-fc-border px-3 py-3">
                <span className="text-xs font-semibold text-fc-brand">FieldCrew</span>
              </div>
              <div className="flex-1 space-y-2 p-3">
                <div className="flex items-center gap-2 rounded-lg bg-fc-accent px-3 py-2.5 text-white">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Clock In</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-fc-border bg-fc-surface px-3 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-fc-muted" />
                  <span className="text-sm text-fc-brand">Select Job</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-fc-border bg-fc-surface px-3 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-fc-muted" />
                  <span className="text-sm text-fc-brand">Add Notes</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-fc-border bg-fc-surface px-3 py-2.5">
                  <Camera className="h-4 w-4 shrink-0 text-fc-muted" />
                  <span className="text-sm text-fc-brand">Upload Photo</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-fc-border bg-fc-surface px-3 py-2.5">
                  <LogOut className="h-4 w-4 shrink-0 text-fc-muted" />
                  <span className="text-sm text-fc-brand">Clock Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 rounded-full bg-fc-surface p-2 shadow-md">
          <Smartphone className="h-5 w-5 text-fc-muted" />
        </div>
      </div>

      <Card variant="muted" className="max-w-sm p-6">
        <h3 className="font-semibold text-fc-brand">2 taps to track</h3>
        <p className="mt-2 text-sm text-fc-muted">
          Your crew clocks in, picks a job, and clocks out. Low friction — no long forms.
        </p>
      </Card>
    </div>
  );
}
