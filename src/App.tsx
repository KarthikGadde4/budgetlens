import { useState } from 'react'
import './App.css'
import type { Transaction } from "./types/transaction";
function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const addTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: Number(amount),
      type,
      category: "Food",
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