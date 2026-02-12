"use client";

import { Search, HelpCircle, Bell, ChevronDown } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/10 bg-fc-app-header px-4">
      <button
        type="button"
        className="rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
        aria-label="Menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-xl items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white/70 focus-within:bg-white/15 focus-within:text-white">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="search"
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-sm placeholder-white/50 outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex -space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-medium text-white ring-2 ring-fc-app-header">
            FC
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fc-accent text-xs font-medium text-white ring-2 ring-fc-app-header">
            U
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Invite
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
          aria-label="Profile"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
