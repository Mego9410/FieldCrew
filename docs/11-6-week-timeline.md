# 6-Week Execution Timeline

This document defines the **non-negotiable milestones** for the first 6 weeks.
The goal is not polish — it is **paying users** and **validated switching**.

Rule:
If a task does not directly support:
- job-based payroll intelligence
- switching validation
- early revenue

It does not ship.

---

## WEEK 1 — Foundation & Architecture

### Objectives
- Lock the product shape
- Prevent rework
- Enable fast iteration

### Deliverables
- Repo created
- Core data model defined
- Auth + magic link flow scaffolded
- Jobs as first-class entity

### Must-Have Outcomes
- Decision made: web app only
- i18n structure in place (English only shipped)
- Translation files created (`en.json` only)
- Explicit rule: **no clock without job**

### Technical Milestones
- Entities defined:
  - User (Owner)
  - Worker
  - Job
  - TimeEntry
- Relationships locked
- Migration strategy agreed

### Validation Check
At end of Week 1 you should be able to answer:
> “Is it impossible to track time without a job?”

If not, stop and fix.

---

## WEEK 2 — Worker Flow (The Money Pipe Starts Here)

### Objectives
- Remove all worker friction
- Force job attribution at clock-in

### Deliverables
- Magic link SMS flow working
- Worker clock-in / clock-out screen
- Job selection mandatory
- Time entries persisted cleanly

### Must-Have Outcomes
- Worker needs **no account**
- Clock-in takes <10 seconds
- Job selection is unavoidable

### Screens Completed
- Worker job list
- Clock-in / clock-out
- Confirmation state

### Validation Check
You should be able to simulate:
- 3 workers
- 3 jobs
- Clean time data per job

If workers can bypass jobs, you’ve failed the MVP.

---

## WEEK 3 — Owner Flow & Payroll Export (Moat Activation)

### Objectives
- Turn time data into payroll-usable output
- Prove job-based payroll intelligence works

### Deliverables
- Owner dashboard (minimal)
- Timesheet table (worker × job × hours)
- Payroll CSV export
- Job labour cost calculation

### Must-Have Outcomes
- Payroll CSV includes:
  - Worker
  - Hours
  - Job
  - Calculated labour cost
- Owner can run payroll using export

### Screens Completed
- Timesheet view
- Payroll export action
- Job labour summary table

### Validation Check
Ask:
> “Could a real HVAC owner run payroll with this CSV?”

If no — stop and fix before proceeding.

---

## WEEK 4 — Insight, Retention & First Users

### Objectives
- Create the retention hook
- Put the product in real hands

### Deliverables
- Weekly labour summary email
- Basic payroll leak detection
- Onboarding checklist
- First outreach messages sent

### Must-Have Outcomes
- Automated weekly email:
  “Last week’s labour cost by job”
- Flags for:
  - overlapping shifts
  - missing clock-outs
- 10–20 real businesses contacted

### Non-Negotiable
At least **3 real owners** must see:
- their job labour summary
- their payroll export

Feedback > features.

---

## WEEK 5 — Iterate, Fix, Close First Customers

### Objectives
- Convert interest into payment
- Fix what blocks switching

### Deliverables
- Feedback loop implemented
- First pricing live
- Stripe (or equivalent) live
- Founders plan available

### Must-Have Outcomes
- First paying customer
- At least 5 active trial users
- Clear objection list documented

### Focus Areas
- Onboarding friction
- CSV format issues
- Job naming confusion
- Worker usability

### Validation Check
If no one is willing to pay:
- your pitch is wrong
- or your insight isn’t sharp enough

Do not add features yet.

---

## WEEK 6 — Stabilise & Prepare for Scale

### Objectives
- Make the product boringly reliable
- Prepare for consistent outbound

### Deliverables
- Bug fixes
- Data integrity checks
- Basic metrics dashboard
- Internal SOPs started

### Must-Have Outcomes
- Clean data across jobs
- No payroll-breaking bugs
- Clear definition of “active customer”

### Metrics to Track
- # active companies
- # jobs tracked
- # payroll exports run
- # weekly emails opened

If owners open the weekly email — you’re winning.

---

## End of Week 6: Non-Exec Decision Gate

Ask honestly:

1. Are owners seeing labour cost per job for the first time?
2. Would losing this data be painful for them?
3. Has at least one customer switched from an existing tool?

If **yes**:
- double down
- scale outbound
- ignore feature requests not tied to payroll

If **no**:
- tighten niche
- sharpen insight
- do NOT broaden product

---

## Guiding Rule (Print This)

> We are not building features.
> We are building dependency.

This 6-week plan exists to prove that dependency.
