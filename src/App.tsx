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

const CATEGORIES: Category[] = [
  "Rent", "Groceries", "Dining", "Transportation",
  "Subscriptions", "Shopping", "Healthcare", "Entertainment",
  "Savings", "Other",
];

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

const currentYear = new Date().getFullYear();
const MIN_DATE = `${currentYear - 50}-01-01`;
const MAX_DATE = `${currentYear + 50}-12-31`;

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<Category>("Other");
  const [date, setDate] = useState("");

  const addTransaction = () => {
    if (amount === "") { alert("Please enter an amount."); return; }
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) { alert("Please enter a valid number."); return; }
    if (numericAmount <= 0) { alert("Please enter an amount greater than 0."); return; }
    if (date === "") { alert("Please select a date."); return; }
    if (date < MIN_DATE || date > MAX_DATE) {
      alert(`Date must be between ${MIN_DATE} and ${MAX_DATE}.`);
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: numericAmount,
      type,
      category: type === "income" ? "Income" : category,
      date,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setDate("");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const lineChartData = useMemo(() => {
    const dailyNet = new Map<string, number>();
    for (const t of transactions) {
      const delta = t.type === "income" ? t.amount : -t.amount;
      dailyNet.set(t.date, (dailyNet.get(t.date) ?? 0) + delta);
    }
    const sorted = [...dailyNet.entries()].sort(([a], [b]) => a.localeCompare(b));
    let running = 0;
    return sorted.map(([date, delta]) => {
      running += delta;
      return { date, balance: parseFloat(running.toFixed(2)) };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const t of transactions.filter((t) => t.type === "expense")) {
      totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    }
    return [...totals.entries()].map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      fill: CATEGORY_COLORS[name] ?? "#94a3b8",
    }));
  }, [transactions]);

  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">BudgetLens</h1>
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
              <input
                className="field-input"
                type="date"
                value={date}
                min={MIN_DATE}
                max={MAX_DATE}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

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
        {sortedTransactions.length === 0 ? (
          <p className="empty-state">No transactions yet. Add one above!</p>
        ) : (
          <ul className="transaction-list">
            {sortedTransactions.map((t) => (
              <li key={t.id} className={`transaction-item ${t.type === "income" ? "tx-income" : "tx-expense"}`}>
                <div className="tx-left">
                  <span className="tx-category">{t.category}</span>
                  <span className="tx-meta">{t.date}</span>
                </div>
                <div className="tx-right">
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
