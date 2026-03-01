"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Worker } from "@/lib/entities";
import { Send, Clock, UserCheck } from "lucide-react";

type InviteChoice = "send_now" | "send_later" | "self_onboard";

interface InviteCrewProps {
  workers: Worker[];
  onChoice: (choice: InviteChoice) => void;
  onSendNow: () => Promise<{ sent: number }>;
  onContinue?: () => void;
}

export function InviteCrew({ workers, onChoice, onSendNow, onContinue }: InviteCrewProps) {
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const toSend = workers.filter((w) => w.inviteStatus !== "sent" && w.inviteStatus !== "accepted");
  const alreadySent = workers.filter((w) => w.inviteStatus === "sent" || w.inviteStatus === "accepted");

  const handleSendNow = async () => {
    setSending(true);
    try {
      const { sent } = await onSendNow();
      setSentCount(sent);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {sentCount !== null ? (
        <Card className="border-fc-success bg-fc-success-bg p-6">
          <p className="font-semibold text-fc-success">
            {sentCount} invite{sentCount !== 1 ? "s" : ""} sent
          </p>
          <p className="mt-1 text-sm text-fc-muted">
            Crew will get an SMS with a link to start tracking.
          </p>
          {onContinue && (
            <Button className="mt-4" onClick={onContinue}>
              Continue to pay rules
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => handleSendNow()}
              disabled={toSend.length === 0 || sending}
              className="flex flex-col items-center gap-2 rounded-lg border-2 border-fc-border p-6 text-center transition-colors hover:border-fc-accent hover:bg-fc-accent/5 disabled:opacity-50"
            >
              <Send className="h-8 w-8 text-fc-accent" />
              <span className="font-medium text-fc-brand">Send SMS invites now</span>
              <span className="text-xs text-fc-muted">
                {toSend.length} ready to send
              </span>
            </button>
            <button
              type="button"
              onClick={() => onChoice("send_later")}
              className="flex flex-col items-center gap-2 rounded-lg border-2 border-fc-border p-6 text-center transition-colors hover:border-fc-accent hover:bg-fc-accent/5"
            >
              <Clock className="h-8 w-8 text-fc-muted" />
              <span className="font-medium text-fc-brand">Send later</span>
              <span className="text-xs text-fc-muted">From dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => onChoice("self_onboard")}
              className="flex flex-col items-center gap-2 rounded-lg border-2 border-fc-border p-6 text-center transition-colors hover:border-fc-accent hover:bg-fc-accent/5"
            >
              <UserCheck className="h-8 w-8 text-fc-muted" />
              <span className="font-medium text-fc-brand">I’ll onboard them myself</span>
              <span className="text-xs text-fc-muted">Share link manually</span>
            </button>
          </div>

          {sending && (
            <p className="text-sm text-fc-muted">Sending invites…</p>
          )}

          {alreadySent.length > 0 && (
            <Card variant="muted" className="p-4">
              <p className="text-sm font-medium text-fc-brand">
                {alreadySent.length} invite{alreadySent.length !== 1 ? "s" : ""} already sent
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
