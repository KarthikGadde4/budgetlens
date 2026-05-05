# BudgetLens — Core Requirements Document

## Purpose

BudgetLens is a frontend-only personal finance tracker that helps users log income and expenses, view their current balance, and understand their spending over time.

The app is designed to run locally in the browser without requiring a backend, account system, database, or paid APIs.

## Core Features

### 1. Transaction Management

Users can:

- Add income or expense transactions
- Enter an amount
- Select a date
- Choose income or expense
- Select an expense category when needed
- Delete transactions from the history list

The app validates transaction input before saving:

- Amount is required
- Amount must be a valid number
- Amount must be greater than zero
- Date is required

### 2. Summary Dashboard

The app displays:

- Total income
- Total expenses
- Current balance

These values update automatically whenever transactions are added or deleted.

### 3. Data Visualization

The app includes charts to help users understand their finances:

- A line chart showing balance over time
- A pie chart showing expenses by category

The chart data is calculated from the user’s transactions.

### 4. Transaction History

The app displays a transaction history section where users can review previous transactions.

Each transaction shows:

- Type
- Category
- Date
- Amount
- Optional note/details, if included
- Delete button

### 5. Persistence

Transactions are saved in the browser using `localStorage`.

This means users can refresh the page and still see their saved transactions.

## Data Model

Each transaction follows this structure:

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

## Technical Requirements

- Frontend-only application
- Built with React and TypeScript
- Uses Vite for development/build tooling
- Uses plain CSS for styling
- Uses `localStorage` for persistence
- Uses a charting library for visualizations
- No paid APIs
- No backend required

## Completion Criteria

The project is complete when:

- Users can add valid transactions
- Invalid transactions are rejected
- Users can delete transactions
- Summary totals update correctly
- Charts update from transaction data
- Transactions persist after refresh
- The app can be run locally using the README instructions