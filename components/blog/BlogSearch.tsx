"use client";

import { useCallback } from "react";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BlogSearch({
  value,
  onChange,
  placeholder = "Search posts…",
}: BlogSearchProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <label className="block">
      <span className="sr-only">Search blog posts</span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-fc-border bg-fc-surface px-4 py-2.5 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-0"
        aria-label="Search blog posts"
      />
    </label>
  );
}
