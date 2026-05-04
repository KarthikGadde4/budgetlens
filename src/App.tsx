import { useState } from 'react'
import './App.css'
import type { Transaction } from "./types/transaction";
function App() {
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
  | "Income"
  | "Other";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<Category>("Other");

  const addTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: Number(amount),
      type,
      category,
      date: "2026-05-04",
      note: "test",
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
  };

  return (
    <div>
      <h1>BudgetLens</h1>

      <input
        type="text"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={addTransaction}>
        Add Transaction
      </button>

      
    <div>
      <p>Current type: {type}</p>
    <button onClick={() => setType("expense")}>
      Expense
    </button>

    <button onClick={() => setType("income")}>
      Income
    </button>
  </div>
  
  <select
  value={category}
  onChange={(e) => setCategory(e.target.value as Category)}
>
  <option value="Rent">Rent</option>
  <option value="Groceries">Groceries</option>
  <option value="Dining">Dining</option>
  <option value="Transportation">Transportation</option>
  <option value="Subscriptions">Subscriptions</option>
  <option value="Shopping">Shopping</option>
  <option value="Healthcare">Healthcare</option>
  <option value="Entertainment">Entertainment</option>
  <option value="Savings">Savings</option>
  <option value="Income">Income</option>
  <option value="Other">Other</option>
</select>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type} - ${t.amount} - {t.category}
          </li>
        ))}
      </ul>
    </div>
  );

  
}

export default App;