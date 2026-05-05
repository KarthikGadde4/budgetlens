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
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const addTransaction = () => {
    if (amount === ""){
      alert("Please enter an amount.");
      return;
    }
    
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      alert("Please enter a valid number.");
      return;
    }

    if (numericAmount <= 0){
      alert("Please enter an amount greater than 0.");
      return;
    }
    if (date === "") {
    alert("Please select a date.");
    return;
  }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: numericAmount,
      type,
      category,
      date,
      note,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setDate("");
    setNote("");
  };
  //Start with all transactions
  //→ keep only income transactions
  //→ add up their amounts
  //→ store result in totalIncome
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const totalExpenses = transactions
    .filter((transactions) => transactions.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  //Go through every transaction.
  //Keep only the transactions whose id does NOT match the id we want to delete.
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  
  };

  return (
    <div>
      <h1>BudgetLens</h1>

      <div>
        <p>Total Income: ${totalIncome}</p>
        <p>Total Expenses: ${totalExpenses}</p>
        <p>Balance: ${balance}</p>
      </div>

      <input
        type="text"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        />
        <input
        type="text"
        placeholder='Add a note'
        value={note}
        onChange={(e) => setNote(e.target.value)}
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
            {t.type} - ${t.amount} - {t.category} - {t.date} - {t.note}
            <button onClick={() => deleteTransaction(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  
}

export default App;