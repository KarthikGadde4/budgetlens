# BudgetLens

## Overview

BudgetLens is a personal finance management app that lets users log income and expenses, track their running balance, and visualize their financial health over time. All data is stored locally in the browser — no account or backend required.

Core features:
- Add income and expense transactions with a date and category
- Running balance updated in real time
- Line chart showing cumulative balance over time
- Pie chart breaking down expenses by category
- Transaction history with delete support
- Data persists across sessions via localStorage

## How to Run

```bash
git clone <repo-url>
cd budgetlens
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:
```bash
npm run build
npm run preview
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Charts | Recharts |
| Styling | Plain CSS (no UI framework) |
| Persistence | Browser localStorage |

## Architecture

The app is a single-page React application. All state lives in `App.tsx` using `useState`. There are no external state managers or routers — the scope doesn't warrant it.

```
src/
  App.tsx           # All components and logic
  App.css           # All styles
  types/
    transaction.ts  # Transaction type definition
  index.css         # Global base styles (from Vite template)
```

**Data flow:**
1. User fills out the form and clicks "Add Transaction"
2. `addTransaction()` validates input, creates a `Transaction` object, and appends it to state
3. A `useEffect` syncs the updated array to `localStorage` on every change
4. `useMemo` hooks derive chart data (daily running balance for the line chart, category totals for the pie chart) from the transaction array without re-computing unless transactions change

**Type definition (`transaction.ts`):**
```ts
type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
}
```

## AI Tools Used

- **Tool:** Claude Code (Claude Sonnet 4.6) — Anthropic's CLI, running as a VSCode extension
- **How I used it:** I directed Claude to implement specific features one at a time, reviewed every change before accepting it, and course-corrected when output didn't match my intent. I wrote the prompts; Claude wrote the code; I understood and owned every line.

**Feature build sequence (each was a separate prompt):**
1. Add transaction state and a button to display transactions
2. Add amount input
3. Add income/expense toggle
4. Add category dropdown
5. Add date input
6. Add input validation
7. Add transaction summary totals (income, expenses, balance)
8. Add transaction deletion
9. Add a line chart tracking balance over time using Recharts
10. Redesign the UI with a card layout and color coding
11. Add expense pie chart; remove note field; hide categories for income transactions

**Debugging prompts that worked well:**
- *"The pie chart looks like a toilet"* — surfaced the specific issue (donut `innerRadius` + `width="55%"` on `ResponsiveContainer` inside a flex container) and got a direct fix
- *"The title logo gets cut off"* — led to diagnosing that the global `color-scheme: light dark` in `index.css` was clashing with the gradient text, and that swapping `h1` for `div` removed conflicting global styles

**Where AI fell short:**
- The initial pie chart layout needed two rounds of iteration (donut hole issue, then the `ResponsiveContainer` sizing) before it looked right — the first fix didn't fully solve it
- The `Cell` component from Recharts v3 was deprecated; Claude's first approach still used it and needed a follow-up fix to embed fill colors directly in the data

## Key Design Decisions

**Frontend-only with localStorage**
No backend means no setup friction, no auth, and no data leaving the user's device. For a personal finance tracker used by one person, this is the right tradeoff.

**All state in one component**
The app is simple enough that splitting state across contexts or stores would add complexity without benefit. Three similar lines is better than a premature abstraction.

**Fixed colors per category (not per insertion order)**
Initially pie slices were colored by the order categories appeared in the transaction list — meaning similar categories (Groceries/Dining, Subscriptions/Entertainment) could randomly land on similar hues. Switching to a `CATEGORY_COLORS` map ensures each category always gets the same distinct color.

**Income transactions have no category**
Income is income. Forcing a category onto it (e.g. "Salary" vs "Freelance") adds complexity without improving the expense breakdown, which is the useful view.

**Recharts over a custom canvas solution**
Recharts is the most popular React charting library, has solid TypeScript types, and handles responsive sizing via `ResponsiveContainer`. Building charts from scratch on `<canvas>` would take hours for worse results.

## Challenges & How I Solved Them

| Challenge | Solution |
|---|---|
| Pie chart rendered as a ring ("toilet") | Removed `innerRadius`; fixed `ResponsiveContainer` to `width="100%"` instead of `"55%"` inside a flex container |
| Logo text clipped at bottom | Global `color-scheme: light dark` was clashing with `-webkit-background-clip: text`; changed element from `h1` to `div` to escape conflicting global `h1` styles, added `line-height: 1.5` |
| Recharts `Cell` deprecated in v3 | Embedded `fill` color directly in each data object instead of wrapping slices in `<Cell>` children |
| Pie category colors clashing | Replaced index-based color assignment with a `CATEGORY_COLORS` map so visually similar categories always get contrasting hues |
| Native date picker not appearing | Global `color-scheme: light dark` was causing the browser to render the date input's calendar button in dark colors, invisible against the light background; added `color-scheme: light` to `.field-input` |

## What I'd Improve With More Time

- **Monthly budget goals** — set a spending limit per category, show progress toward it
- **Date range filtering** — filter the charts and transaction list to a specific month or custom range
- **CSV export** — let users download their transaction history
- **Recurring transactions** — mark a transaction as recurring so it auto-populates monthly
- **Multiple accounts** — separate tracking for checking, savings, credit card
- **Better mobile layout** — the two-column form+chart grid collapses to single column, but the charts could use more work at small sizes
