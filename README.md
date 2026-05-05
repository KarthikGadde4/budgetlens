# BudgetLens

## Overview

BudgetLens is a frontend-only personal finance tracker that helps users record income and expenses, view their current balance, and understand their spending through charts.

Users can add transactions with an amount, date, transaction type, category, and optional note/details. The app calculates total income, total expenses, and balance in real time. It also saves transactions in the browser using `localStorage`, so the data persists after refreshing the page.

The goal of this project was to build a simple, functional finance dashboard without requiring a backend, authentication, or paid APIs.

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/KarthikGadde4/budgetlens
```

2. Move into the project folder:

```bash
cd budgetlens
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local Vite URL in your browser:

```bash
http://localhost:5173
```

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Tech Stack

- React
- TypeScript
- Vite
- Plain CSS
- Recharts
- Browser `localStorage`

## Architecture

BudgetLens is a single-page React application. Most of the current app logic lives in `App.tsx`, with styling handled in `App.css`.

The main data structure is a `Transaction` object:

```ts
type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
};
```

The app stores transactions in React state:

```ts
const [transactions, setTransactions] = useState<Transaction[]>([]);
```

The general data flow is:

1. The user enters transaction details into controlled form inputs.
2. Each input updates its own React state variable.
3. When the user adds a transaction, the app validates the input.
4. If the input is valid, a new transaction object is created.
5. The new transaction is added to the `transactions` array using `setTransactions`.
6. Summary totals and chart data are derived from the transaction array.
7. A `useEffect` saves the updated transactions to `localStorage`.
8. When the app reloads, saved transactions are loaded back into state.

The project is intentionally frontend-only. There is no backend, authentication, or database because the challenge can be completed with local browser storage.

## AI Tools Used

- **Tool:** ChatGPT  
- **How I used it:** I used ChatGPT as a step-by-step learning and debugging partner for the core React logic. It helped me reason through controlled inputs, state updates, validation, `filter()`, `reduce()`, delete logic, and `localStorage` persistence. I used it to understand the logic before moving to the next feature.

- **Tool:** Claude Code  
- **How I used it:** I used Claude Code mainly for frontend/UI polish after the core functionality was working. Claude helped improve the dashboard layout, card styling, spacing, colors, chart presentation, and responsive design.

- **Prompts that worked well:**


I used AI tools during the project, but I reviewed the generated changes and made sure I understood the code I kept. My main focus was to build and understand the core application logic first, then use AI assistance to improve presentation and polish.

## Key Design Decisions

### React state as the source of information

Each form field is controlled by React state. For example, the amount input uses `value={amount}` to display the current state and `onChange` to update it as the user types. This keeps the form data inside React instead of relying on the DOM separately.


### localStorage for persistence

React state resets when the page refreshes, so I used `localStorage` to save transactions in the browser. Since `localStorage` only stores strings, the app uses `JSON.stringify()` when saving transactions and `JSON.parse()` when loading them.

### Plain CSS for styling

I used plain CSS instead of a UI framework so the app would stay lightweight and easy to explain. This also made it easier to customize the dashboard layout directly.

### AI-assisted UI polish

I built and understood the main application logic first, then used Claude Code to help polish the frontend. This let me focus on the important logic while still producing a cleaner and more professional-looking final app.

## Challenges & How I Solved Them

### Understanding controlled inputs

One of the first challenges was understanding how React form inputs work. I initially did not fully understand the relationship between `value`, `onChange`, and state.

I solved this by breaking the pattern down:

```text
state = storage
setState = updater
value = what the input displays
onChange = what updates state when the user types
```

Once I understood that pattern, I reused it for the amount, date, category, type, and note fields.

### Preventing invalid transactions

At first, the app could create transactions with missing or invalid values. For example, an empty amount could become `0`, and non-number text could turn into `NaN`.

I solved this by adding validation inside `addTransaction()`. The app checks that the amount exists, converts it with `Number(amount)`, rejects invalid numbers with `Number.isNaN()`, requires the amount to be greater than zero, and checks that a date is selected before saving.

### Keeping totals in sync with transactions

Another challenge was calculating total income, total expenses, and balance without creating unnecessary state.

I solved this by deriving the totals from the transaction array instead of storing them separately. I used `filter()` to separate income and expense transactions, then `reduce()` to add their amounts. That way, whenever transactions change, the totals naturally update.

### Persisting transactions after refresh

Originally, all transactions disappeared when the page refreshed because they only existed in React state.

I solved this with `localStorage`. When the app first loads, it checks for saved transactions and parses them back into an array. Whenever the transaction list changes, a `useEffect` saves the updated array back to `localStorage`.

AI helped me reason through the syntax and implementation details, but I made sure I understood the flow well enough to explain it.

### Using AI as Assistance

Claude Code was helpful for improving the frontend design, but I still had to make sure the generated UI changes did not break the existing logic. I used the AI output as a starting point, reviewed the changes, tested the app, and made sure I could explain the code before keeping it. AI also aided in the formatting and wording of both the README.md and REQUIREMENTS.md files.

## What I'd Improve With More Time

- Add date range filtering for transactions and charts
- Add a CSV export
- Add recurring transactions
- Break `App.tsx` into smaller reusable components as the app grows
- Add better handling for corrupted or invalid `localStorage` data
- Make a usable mobile design