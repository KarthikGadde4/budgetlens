import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import type { Transaction } from "./types/transaction";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addDummyTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: 20,
      type: "expense",
      category: "Food",
      date: "2026-05-04",
      note: "Test"
    };

    setTransactions([...transactions, newTransaction]);
  };

  return (
    <div>
      <h1>BudgetLens</h1>

      <button onClick={addDummyTransaction}>
        Add Test Transaction
      </button>

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