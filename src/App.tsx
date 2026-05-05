import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Transaction } from "./types/transaction";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

// Union type — category can only be one of these exact strings
type Category =
  | "Rent"
  | "Groceries"
  | "Dining"
  | "Transportation"
  | "Subscriptions"
  | "Shopping"
  | "Healthcare"
  | "Entertainment"
  | "Savings"
  | "Other";

// Used to populate the category dropdown for expense transactions
const CATEGORIES: Category[] = [
  "Rent", "Groceries", "Dining", "Transportation",
  "Subscriptions", "Shopping", "Healthcare", "Entertainment",
  "Savings", "Other",
];

// Fixed color per category so each slice always looks the same in the pie chart
const CATEGORY_COLORS: Record<string, string> = {
  Rent:           "#6366f1",
  Groceries:      "#10b981",
  Dining:         "#ef4444",
  Transportation: "#3b82f6",
  Subscriptions:  "#f59e0b",
  Shopping:       "#ec4899",
  Healthcare:     "#14b8a6",
  Entertainment:  "#8b5cf6",
  Savings:        "#f97316",
  Other:          "#94a3b8",
};

// Valid date range: 50 years in the past to 50 years in the future
const currentYear = new Date().getFullYear();
const MIN_DATE = `${currentYear - 50}-01-01`;
const MAX_DATE = `${currentYear + 50}-12-31`;

function App() {
  // Load saved transactions from localStorage on first render, or start with an empty array
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Controlled form inputs — each piece of state tracks one field
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<Category>("Other");
  const [date, setDate] = useState("");

  // Validates the form and adds a new transaction to the list
  const addTransaction = () => {
    if (amount === "") { alert("Please enter an amount."); return; }
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) { alert("Please enter a valid number."); return; }
    if (numericAmount <= 0) { alert("Please enter an amount greater than 0."); return; }
    if (date === "") { alert("Please select a date."); return; }
    // Reject dates outside the allowed ±50 year range
    if (date < MIN_DATE || date > MAX_DATE) {
      alert(`Date must be between ${MIN_DATE} and ${MAX_DATE}.`);
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(), // unique ID based on timestamp
      amount: numericAmount,
      type,
      // Income transactions don't use categories — label them "Income"
      category: type === "income" ? "Income" : category,
      date,
    };

    setTransactions([...transactions, newTransaction]);
    // Reset the form fields after adding
    setAmount("");
    setDate("");
  };

  // Derived totals — calculated from the transaction array, not stored in state
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Removes a transaction by filtering out the one with the matching id
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Save transactions to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Build data for the line chart — computes a running balance grouped by date
  const lineChartData = useMemo(() => {
    // Group net amounts per day (income is positive, expense is negative)
    const dailyNet = new Map<string, number>();
    for (const t of transactions) {
      const delta = t.type === "income" ? t.amount : -t.amount;
      dailyNet.set(t.date, (dailyNet.get(t.date) ?? 0) + delta);
    }
    // Sort days chronologically
    const sorted = [...dailyNet.entries()].sort(([a], [b]) => a.localeCompare(b));
    // Accumulate balance as we walk forward through dates
    let running = 0;
    return sorted.map(([date, delta]) => {
      running += delta;
      return { date, balance: parseFloat(running.toFixed(2)) };
    });
  }, [transactions]);

  // Build data for the pie chart — total spending per expense category
  const pieData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const t of transactions.filter((t) => t.type === "expense")) {
      totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    }
    return [...totals.entries()].map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      fill: CATEGORY_COLORS[name] ?? "#94a3b8", // fallback color for unknown categories
    }));
  }, [transactions]);

  // Show newest transactions first
  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="app">
      <header className="header">
        <div className="logo">BudgetLens</div>
        <p className="tagline">Track your financial health</p>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card income-card">
          <span className="summary-label">Total Income</span>
          <span className="summary-amount">+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="summary-card expense-card">
          <span className="summary-label">Total Expenses</span>
          <span className="summary-amount">-${totalExpenses.toFixed(2)}</span>
        </div>
        {/* Balance card switches color class depending on whether balance is positive or negative */}
        <div className={`summary-card balance-card ${balance >= 0 ? "balance-positive" : "balance-negative"}`}>
          <span className="summary-label">Balance</span>
          <span className="summary-amount">${balance.toFixed(2)}</span>
        </div>
      </div>

      {/* Main content: form + charts */}
      <div className="main-grid">
        {/* Add Transaction Form */}
        <div className="card">
          <h2 className="card-title">Add Transaction</h2>

          {/* Toggle between Expense and Income — updates the `type` state */}
          <div className="type-toggle">
            <button
              className={`toggle-btn ${type === "expense" ? "active-expense" : ""}`}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
            <button
              className={`toggle-btn ${type === "income" ? "active-income" : ""}`}
              onClick={() => setType("income")}
            >
              Income
            </button>
          </div>

          <div className="form-fields">
            <label className="field-label">
              Amount
              <input
                className="field-input"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            <label className="field-label">
              Date
              {/* min/max restrict the calendar picker to ±50 years */}
              <input
                className="field-input"
                type="date"
                value={date}
                min={MIN_DATE}
                max={MAX_DATE}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            {/* Only show category selector for expense transactions */}
            {type === "expense" && (
              <label className="field-label">
                Category
                <select
                  className="field-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <button className="add-btn" onClick={addTransaction}>
            + Add Transaction
          </button>
        </div>

        {/* Charts column */}
        <div className="charts-column">
          {/* Line chart */}
          <div className="card">
            <h2 className="card-title">Balance Over Time</h2>
            {/* Only render the chart if there is data to show */}
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Balance"]}
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Balance"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty"><p>Add transactions to see your balance chart.</p></div>
            )}
          </div>

          {/* Pie chart */}
          <div className="card">
            <h2 className="card-title">Expenses by Category</h2>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} contentStyle={{ borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom legend — shows color dot, category name, and percentage of total expenses */}
                <ul className="pie-legend">
                  {pieData.map((entry) => (
                    <li key={entry.name} className="pie-legend-item">
                      <span className="pie-dot" style={{ background: entry.fill }} />
                      <span className="pie-legend-name">{entry.name}</span>
                      <span className="pie-legend-pct">
                        {((entry.value / totalExpenses) * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="chart-empty"><p>Add expenses to see the breakdown.</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        <h2 className="card-title">Transaction History</h2>
        {/* Show a message if no transactions exist yet */}
        {sortedTransactions.length === 0 ? (
          <p className="empty-state">No transactions yet. Add one above!</p>
        ) : (
          <ul className="transaction-list">
            {sortedTransactions.map((t) => (
              // Apply different border color class based on transaction type
              <li key={t.id} className={`transaction-item ${t.type === "income" ? "tx-income" : "tx-expense"}`}>
                <div className="tx-left">
                  <span className="tx-category">{t.category}</span>
                  <span className="tx-meta">{t.date}</span>
                </div>
                <div className="tx-right">
                  {/* Show + for income, - for expenses */}
                  <span className={`tx-amount ${t.type === "income" ? "amount-income" : "amount-expense"}`}>
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </span>
                  <button className="delete-btn" onClick={() => deleteTransaction(t.id)} title="Delete">
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
