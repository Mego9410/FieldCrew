/**
 * Mock settings data layer. API-ready structure.
 * TODO: Replace with real API calls when backend is available.
 */

import { getOwnerUsers, getCompanies, updateOwnerUser, updateCompany } from "./data";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  avatarUrl: string | null;
}

export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  taxId: string;
  currency: string;
  otDailyThreshold: number;
  otWeeklyThreshold: number;
  otMultiplier: number;
}

export interface NotificationPrefs {
  // Admin/Owner
  weeklyLabourSummaryEmail: boolean;
  overtimeThresholdEmail: boolean;
  overtimeThresholdInApp: boolean;
  jobOverBudgetInApp: boolean;
  unapprovedTimesheetsEmail: boolean;
  // Worker
  clockInReminderInApp: boolean;
  breakReminderInApp: boolean;
  shiftEditedEmail: boolean;
}

export interface BillingSettings {
  planName: string;
  planPrice: number;
  seatsUsed: number;
  seatsLimit: number;
  cardBrand: string;
  cardLast4: string;
  cardExpiry: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid";
}

export interface Settings {
  profile: ProfileSettings;
  company: CompanySettings;
  notifications: NotificationPrefs;
  billing: BillingSettings;
  invoices: Invoice[];
}

// ─── Defaults ──────────────────────────────────────────────────────────────

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  weeklyLabourSummaryEmail: true,
  overtimeThresholdEmail: true,
  overtimeThresholdInApp: true,
  jobOverBudgetInApp: true,
  unapprovedTimesheetsEmail: true,
  clockInReminderInApp: true,
  breakReminderInApp: true,
  shiftEditedEmail: true,
};

// ─── Storage ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "fc_settings";
const INVOCES_KEY = "fc_settings_invoices";

function isBrowser() {
  return typeof window !== "undefined";
}

function get<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("settings.mock: failed to write", key, e);
  }
}

// ─── Build from mock entities ──────────────────────────────────────────────

async function buildProfile(): Promise<ProfileSettings> {
  const users = await getOwnerUsers();
  const owner = users[0];
  const nameParts = (owner?.name ?? "Admin User").split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";
  return {
    firstName,
    lastName,
    email: owner?.email ?? "owner@fieldcrew.com",
    phone: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "America/New_York",
    avatarUrl: null,
  };
}

async function buildCompany(): Promise<CompanySettings> {
  const companies = await getCompanies();
  const c = companies[0];
  const addr = (c?.address ?? "100 Business Ave, City").split(",").map((s) => s.trim());
  return {
    name: c?.name ?? "Field Crew HVAC",
    email: "",
    phone: "",
    street: addr[0] ?? "",
    city: addr[1] ?? "",
    state: "",
    zip: "",
    country: "US",
    taxId: "",
    currency: "USD",
    otDailyThreshold: 8,
    otWeeklyThreshold: 40,
    otMultiplier: 1.5,
  };
}

function buildBilling(): BillingSettings {
  return {
    planName: "Starter",
    planPrice: 29,
    seatsUsed: 5,
    seatsLimit: 10,
    cardBrand: "Visa",
    cardLast4: "4242",
    cardExpiry: "12/28",
  };
}

function buildInvoices(): Invoice[] {
  const stored = get<Invoice[]>(INVOCES_KEY, []);
  if (stored.length > 0) return stored;
  const seed: Invoice[] = [
    { id: "inv-1", date: "2026-02-01", amount: 29, status: "Paid" },
    { id: "inv-2", date: "2026-01-01", amount: 29, status: "Paid" },
    { id: "inv-3", date: "2025-12-01", amount: 29, status: "Paid" },
  ];
  set(INVOCES_KEY, seed);
  return seed;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const overrides = get<Partial<Settings>>(STORAGE_KEY, {});
  const [profile, company] = await Promise.all([buildProfile(), buildCompany()]);

  return {
    profile: { ...profile, ...overrides.profile },
    company: { ...company, ...overrides.company },
    notifications: {
      ...DEFAULT_NOTIFICATIONS,
      ...overrides.notifications,
    },
    billing: { ...buildBilling(), ...overrides.billing },
    invoices: overrides.invoices ?? buildInvoices(),
  };
}

export async function saveSettings(partial: Partial<Settings>): Promise<void> {
  const current = get<Partial<Settings>>(STORAGE_KEY, {});

  if (partial.profile) {
    const users = await getOwnerUsers();
    const owner = users[0];
    if (owner) {
      const fullName = [partial.profile.firstName, partial.profile.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
      await updateOwnerUser(owner.id, {
        name: fullName || owner.name,
        email: partial.profile.email || owner.email,
      });
    }
    const profile = await buildProfile();
    current.profile = { ...profile, ...partial.profile };
  }

  if (partial.company) {
    const companies = await getCompanies();
    const c = companies[0];
    if (c) {
      const addr = [
        partial.company.street,
        [partial.company.city, partial.company.state, partial.company.zip]
          .filter(Boolean)
          .join(" "),
      ]
        .filter(Boolean)
        .join(", ");
      await updateCompany(c.id, {
        name: partial.company.name,
        address: addr || c.address,
      });
    }
    const company = await buildCompany();
    current.company = { ...company, ...partial.company };
  }

  if (partial.notifications) {
    current.notifications = partial.notifications;
  }

  if (partial.billing) {
    current.billing = partial.billing;
  }

  if (partial.invoices) {
    set(INVOCES_KEY, partial.invoices);
    current.invoices = partial.invoices;
  }

  set(STORAGE_KEY, current);
}

export function getDefaultNotifications(): NotificationPrefs {
  return { ...DEFAULT_NOTIFICATIONS };
}
