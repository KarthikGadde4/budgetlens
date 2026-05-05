# BudgetLens — Core Requirements Document

## Purpose

BudgetLens helps individual users track personal income and expenses, understand where their money is going, and monitor their financial health over time — without requiring an account, backend, or any paid services.

---

## Functional Requirements

### Transaction Management

| ID | Requirement | Status |
|---|---|---|
| FR-1 | User can add a transaction with an amount, date, type (income/expense), and category | ✅ |
| FR-2 | Amount must be a positive number; empty or invalid input is rejected with an alert | ✅ |
| FR-3 | Date is required; missing date is rejected with an alert | ✅ |
| FR-4 | Expense transactions require a category selected from a predefined list | ✅ |
| FR-5 | Income transactions do not have a category (income is income) | ✅ |
| FR-6 | User can delete any transaction | ✅ |
| FR-7 | Transactions persist across browser sessions via localStorage | ✅ |

### Expense Categories

Predefined categories for expense transactions:
- Rent, Groceries, Dining, Transportation, Subscriptions, Shopping, Healthcare, Entertainment, Savings, Other

### Summary Display

| ID | Requirement | Status |
|---|---|---|
| FR-8 | Display total income across all transactions | ✅ |
| FR-9 | Display total expenses across all transactions | ✅ |
| FR-10 | Display current balance (total income − total expenses) | ✅ |
| FR-11 | Balance card changes color based on positive/negative value | ✅ |

### Data Visualization

| ID | Requirement | Status |
|---|---|---|
| FR-12 | Line chart showing cumulative balance over time, plotted by date | ✅ |
| FR-13 | Pie chart showing expense breakdown by category as percentage of total expenses | ✅ |
| FR-14 | Charts update in real time as transactions are added or deleted | ✅ |
| FR-15 | Each expense category has a consistent, visually distinct color in the pie chart | ✅ |
| FR-16 | Charts display an empty state message when no data exists | ✅ |

### Transaction History

| ID | Requirement | Status |
|---|---|---|
| FR-17 | All transactions are listed, sorted newest first | ✅ |
| FR-18 | Each row shows category, date, and amount with +/− prefix | ✅ |
| FR-19 | Income and expense transactions are color-coded (green / red) | ✅ |

---

## Non-Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| NFR-1 | No paid external APIs | ✅ |
| NFR-2 | Frontend-only — no server, database, or authentication required | ✅ |
| NFR-3 | App is usable on desktop browsers (Chrome, Firefox, Edge, Safari) | ✅ |
| NFR-4 | Layout is responsive and usable on mobile (single-column below 768px) | ✅ |
| NFR-5 | Chart data is computed programmatically from transactions — no static images | ✅ |

---

## Out of Scope

The following were considered but intentionally excluded to keep the app focused:

- User authentication or multi-user support
- Cloud sync or backend storage
- Recurring / scheduled transactions
- Budget goal-setting per category
- CSV import/export
- Date range filtering
- Multiple account tracking (checking, savings, credit)

---

## Data Model

```ts
type Transaction = {
  id: string;        // Date.now() string — unique per session
  amount: number;    // Positive number
  type: "income" | "expense";
  category: string;  // From predefined list (expenses) or "Income"
  date: string;      // YYYY-MM-DD from native date input
}
```

Transactions are stored as a JSON array in `localStorage` under the key `"transactions"`.
