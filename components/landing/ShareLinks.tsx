"use client";

import { useCallback, useMemo, useState } from "react";
import { safeClipboardWriteText } from "@/lib/safe-clipboard";

type ShareLinksProps = {
  url: string;
  title: string;
  ariaLabel?: string;
};

export function ShareLinks({ url, title, ariaLabel = "Share this page" }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);

  const share = useMemo(() => {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    return {
      x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
  }, [title, url]);

  const copyLink = useCallback(async () => {
    const ok = await safeClipboardWriteText(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-[36px] items-center rounded-md border border-fc-border bg-white px-3 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={share.x}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[36px] items-center rounded-md border border-fc-border bg-white px-3 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        aria-label="Share on X"
      >
        Share on X
      </a>
      <a
        href={share.linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[36px] items-center rounded-md border border-fc-border bg-white px-3 text-sm font-semibold text-fc-brand hover:bg-fc-surface-muted focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
        aria-label="Share on LinkedIn"
      >
        Share on LinkedIn
      </a>
    </div>
  );
}

