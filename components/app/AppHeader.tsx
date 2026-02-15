"use client";

import { Search, HelpCircle, Bell, ChevronDown } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-fc-border bg-[#e2e8f0] px-3">
      <button
        type="button"
        className="p-2 text-fc-muted hover:text-fc-brand"
        aria-label="Menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex flex-1 items-center justify-center px-2">
        <div className="flex w-full max-w-md items-center gap-2 border border-fc-border bg-white px-2.5 py-1.5 focus-within:border-fc-accent focus-within:ring-1 focus-within:ring-fc-accent">
          <Search className="h-4 w-4 shrink-0 text-fc-muted" />
          <input
            type="search"
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-fc-brand placeholder:text-fc-muted outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <button type="button" className="p-2 text-fc-muted hover:text-fc-brand" aria-label="Help">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button type="button" className="p-2 text-fc-muted hover:text-fc-brand" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <div className="ml-1 flex -space-x-1">
          <div className="flex h-7 w-7 items-center justify-center bg-fc-accent text-[10px] font-bold text-white">
            FC
          </div>
        </div>
        <button
          type="button"
          className="ml-1 border border-fc-border bg-white px-2.5 py-1.5 text-xs font-semibold text-fc-brand hover:bg-fc-surface-muted"
        >
          Invite
        </button>
        <button type="button" className="p-2 text-fc-muted hover:text-fc-brand" aria-label="Profile">
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
