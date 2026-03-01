"use client";

import { useCallback, useState } from "react";

interface ShareRowProps {
  url: string;
  title: string;
}

export function ShareRow({ url, title }: ShareRowProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail (e.g. permission, non-HTTPS). Don't throw or we get [object Event] in overlay.
    }
  }, [url]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Share this post">
      <button
        type="button"
        onClick={copyLink}
        className="text-sm font-medium text-fc-muted hover:text-fc-accent transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded px-2 py-1"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-fc-muted hover:text-fc-accent transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded px-2 py-1"
        aria-label="Share on X (Twitter)"
      >
        X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-fc-muted hover:text-fc-accent transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded px-2 py-1"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
    </div>
  );
}
