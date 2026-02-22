# First-Salary On-Ramp — Hackathon CLAUDE.md

## Project Overview

A B2B2C fintech web app prototype for 22–25 year olds entering the workforce.
The employer (B2B) buys the product; the new hire (C) uses it to decode their paycheck and protect their discretionary spend.

**Core Problem:** 41% of new grads are confused by benefits. 100% are shocked by net pay.
**Solution:** HR-deployed tool that explains the paycheck, optimizes benefits via AI, and issues an Airwallex virtual card for "Guilt-Free Spending."

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |
| Icons | Lucide React |
| AI Model | `claude-sonnet-4-6` ← **use this exact model string, not claude-3-5-sonnet** |
| Payroll Data | Plaid (Sandbox) |
| Virtual Card | Airwallex (Sandbox) |

---

## Privacy Wall — Structural Data Mapping Rule

> **Prototype Decision:** No auth middleware or RBAC is implemented. The privacy boundary is enforced structurally through two distinct data models that never merge.

### `PersonalFinancialData` — Private, Local-Only

Exists only in browser memory / local state. Never sent to a shared endpoint. Never aggregated.

```ts
type PersonalFinancialData = {
  employeeId: string;           // mock session token
  grossSalary: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  healthPremium: number;
  retirement401k: number;
  netPay: number;
  benefitElections: BenefitElection[];
  plaidAccessToken: string;     // sandbox only, never logged
};
```

### `CompanyInsights` — Aggregated, Anonymized

Safe for employer dashboards. No PII. Derived from cohort aggregates only.

```ts
type CompanyInsights = {
  cohort: string;               // e.g. "Engineering-2025"
  avgBenefitOptimizationScore: number;
  pct401kMatchCaptured: number;
  avgNetPayConfidenceScore: number;
  cardActivationRate: number;
};
```

**Rule:** No function or component may accept both types as parameters. The boundary is the pitch.

---

## API Workflows

### 1. Plaid — Net-Pay Shock Waterfall

- **Endpoint:** `POST /payroll_income/get`
- **Purpose:** Pull gross salary + all deduction line items to power the animated waterfall visualization ("Salary Story").
- **Sandbox:** Use Plaid Sandbox environment. Mock `access_token` = `access-sandbox-xxxxxx`.
- **Key fields consumed:** `gross_earnings`, `taxes[]`, `deductions[]`, `net_pay`
- **Flow:** Plaid Link OAuth → exchange public token → call `/payroll_income/get` → render waterfall.

### 2. Airwallex — Guilt-Free Spending Virtual Card

- **Action:** Issue a virtual card scoped to a pre-defined "Free Spend" budget derived from net pay.
- **Sandbox API:** `POST /api/v1/issuing/cards`
- **Card type:** Virtual, single-currency (USD), with a configurable spending limit.
- **UX trigger:** User confirms card issuance after seeing net pay — one tap, instant issuance (simulated in sandbox).

### 3. Claude (`claude-sonnet-4-6`) — Babel Fish + Agentic Nudges

- **Model string:** `claude-sonnet-4-6` (confirmed — do not substitute another model ID)
- **Use case 1 — Babel Fish:** Translate opaque benefit jargon into plain English. Input: raw benefit election options. Output: 2-sentence human explanation per benefit.
- **Use case 2 — Agentic Nudge:** Detect uncaptured employer 401k match. Surface a "Staged Action":
  > "I've drafted a 401k contribution update to 6% so you capture your full employer match (+$1,800/yr). Confirm to apply?"
- **Staged Actions pattern:** AI proposes → user sees diff-style preview → user confirms → action executes. Never auto-apply.
- **API:** Anthropic SDK, streaming preferred for the "typing" effect.

---

## 3-Minute Demo Flow

```
1. Employer-Branded Welcome Screen
   └── Company logo + "Welcome to [Employer]. Let's decode your first paycheck."
   └── Mock session: no login required, auto-load demo employee profile

2. Plaid Link → "Salary Story" Waterfall
   └── Animated bar chart: Gross → Taxes → FICA → Benefits → NET PAY
   └── Each deduction drops with a label and dollar amount
   └── Big reveal: NET PAY number at the bottom (the "shock" moment)

3. AI Agent Benefit Optimization — THE WOW MOMENT
   └── Claude scans benefit elections
   └── Detects: employee contributing 2%, employer matches up to 6%
   └── Staged Action card appears:
       "I've drafted a 401k update to 6% to capture your full match (+$1,800/yr). Confirm?"
   └── User taps Confirm → optimized state shown
   └── Babel Fish panel: plain-English explanation of HSA, FSA, 401k

4. Airwallex Virtual Card Issuance
   └── "Your Free Spend budget this month: $XXX"
   └── Tap "Protect My Spend" → virtual card materializes (card flip animation)
   └── Card number, expiry, CVV shown (sandbox mock)
```

---

## Design Guide

| Token | Value |
|---|---|
| Background | `#0A0A0A` (near-black) |
| Surface | `#141414` (Spotify-style card) |
| Accent 1 — Neon Green | `#39FF14` |
| Accent 2 — Electric Blue | `#7DF9FF` |
| Text Primary | `#FFFFFF` |
| Text Muted | `#A3A3A3` |
| Danger/Tax | `#FF4444` |
| **Forbidden** | Corporate grey (`#6B7280` and similar) — do not use |

- **Mode:** Dark mode only. No light mode toggle needed for prototype.
- **Layout language:** Spotify-style rounded cards (`rounded-2xl`), subtle `backdrop-blur`, thin neon borders on active states.
- **Typography:** Inter or Geist. Large numbers for financial figures (`text-5xl font-bold`).
- **Motion:** Framer Motion for the waterfall drop animation and card flip. Keep it snappy (<400ms per step).

---

## Constraints & Shortcuts (22-Hour Solo Build)

- **No backend auth.** Mock the user session with a hardcoded demo employee object in a React context.
- **No database.** All state is in-memory / React state. `PersonalFinancialData` never persists.
- **Plaid/Airwallex/Claude:** All sandbox/test modes. No real credentials in source.
- **env vars:** Store all API keys in `.env.local`. Never commit `.env.local`.
- **Scope guard:** If a feature isn't in the 3-minute demo flow, it doesn't get built.

---

## File Structure (Target)

```
/app
  /page.tsx                  ← Welcome screen (Step 1)
  /salary-story/page.tsx     ← Waterfall visualization (Step 2)
  /benefits/page.tsx         ← AI agent + Babel Fish (Step 3)
  /card/page.tsx             ← Virtual card issuance (Step 4)
  /api
    /plaid/route.ts          ← Plaid payroll_income/get proxy
    /airwallex/route.ts      ← Airwallex card issuance proxy
    /agent/route.ts          ← Claude streaming endpoint
/components
  /WaterfallChart.tsx
  /StagedActionCard.tsx
  /BabelFishPanel.tsx
  /VirtualCardFlip.tsx
/lib
  /mockSession.ts            ← Hardcoded demo employee data
  /types.ts                  ← PersonalFinancialData + CompanyInsights types
```

---

## Model Confirmation

The AI model string used throughout this project is:

```
claude-sonnet-4-6
```

This is intentional and must not be changed to `claude-3-5-sonnet` or any other identifier.
