import React, { useState, useEffect } from "react";
import "./finance-tracker_App.css";

const INITIAL_TRANSACTIONS = [
  { id: "1", description: "Tech Salary", amount: 4200, category: "Salary", type: "income", date: "2026-08-01" },
  { id: "2", description: "Apartment Rent", amount: 1400, category: "Housing", type: "expense", date: "2026-08-02" },
  { id: "3", description: "Grocery Store", amount: 185, category: "Food", type: "expense", date: "2026-08-05" },
  { id: "4", description: "Freelance Project", amount: 850, category: "Freelance", type: "income", date: "2026-08-07" },
  { id: "5", description: "Electric & Gas Bill", amount: 120, category: "Utilities", type: "expense", date: "2026-08-08" },
  { id: "6", description: "Gym Membership", amount: 50, category: "Health", type: "expense", date: "2026-08-09" }
];

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Other Income"],
  expense: ["Housing", "Food", "Utilities", "Health", "Entertainment", "Transport", "Shopping", "Other Expense"]
};

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fintech_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    localStorage.setItem("fintech_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    const newTx = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      category: category,
      type: type,
      date: new Date().toISOString().split("T")[0]
    };

    setTransactions([newTx, ...transactions]);
    setDescription("");
    setAmount("");
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  // Calculations
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Expense Category Breakdown for CSS Bar Chart
  const expenseTransactions = transactions.filter((tx) => tx.type === "expense");
  const categoryTotals = expenseTransactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "all") return true;
    return tx.type === filterType;
  });

  return (
    <div className="finance-app">
      <header className="finance-header">
        <div className="brand">
          <span className="brand-logo">💳</span>
          <div>
            <h1>FinPulse Tracker</h1>
            <p className="subtitle">Personal Cash Flow & Budget Analytics</p>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card balance">
          <span className="card-label">Net Balance</span>
          <h2 className={totalBalance >= 0 ? "positive" : "negative"}>
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="summary-card income">
          <span className="card-label">Total Income</span>
          <h2 className="positive">+${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="summary-card expense">
          <span className="card-label">Total Expenses</span>
          <h2 className="negative">-${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Column: New Transaction Form & Expense Chart */}
        <div className="left-panel">
          {/* Add Transaction Form */}
          <div className="panel-card">
            <h3>Add New Transaction</h3>
            <form onSubmit={handleAddTransaction} className="tx-form">
              <div className="form-group">
                <label>Type</label>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${type === "income" ? "income-active" : ""}`}
                    onClick={() => { setType("income"); setCategory(CATEGORIES.income[0]); }}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${type === "expense" ? "expense-active" : ""}`}
                    onClick={() => { setType("expense"); setCategory(CATEGORIES.expense[0]); }}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Grocery Store, Salary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES[type].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Add {type === "income" ? "Income" : "Expense"}
              </button>
            </form>
          </div>

          {/* CSS Bar Chart: Category Breakdown */}
          <div className="panel-card">
            <h3>Expense Breakdown by Category</h3>
            {totalExpense === 0 ? (
              <p className="no-data">No expense data to display.</p>
            ) : (
              <div className="css-bar-chart">
                {Object.entries(categoryTotals).map(([catName, catAmount]) => {
                  const percentage = Math.round((catAmount / totalExpense) * 100);
                  return (
                    <div key={catName} className="chart-item">
                      <div className="chart-label-row">
                        <span className="cat-name">{catName}</span>
                        <span className="cat-amount">${catAmount.toFixed(2)} ({percentage}%)</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="right-panel">
          <div className="panel-card">
            <div className="history-header">
              <h3>Transaction History</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterType === "all" ? "active" : ""}`}
                  onClick={() => setFilterType("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterType === "income" ? "active" : ""}`}
                  onClick={() => setFilterType("income")}
                >
                  Income
                </button>
                <button
                  className={`filter-btn ${filterType === "expense" ? "active" : ""}`}
                  onClick={() => setFilterType("expense")}
                >
                  Expenses
                </button>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <p className="no-data">No transactions found.</p>
            ) : (
              <ul className="tx-list">
                {filteredTransactions.map((tx) => (
                  <li key={tx.id} className={`tx-item ${tx.type}`}>
                    <div className="tx-main">
                      <span className="tx-desc">{tx.description}</span>
                      <div className="tx-meta">
                        <span className="tx-category">{tx.category}</span>
                        <span className="tx-date">• {tx.date}</span>
                      </div>
                    </div>
                    <div className="tx-right">
                      <span className={`tx-amount ${tx.type}`}>
                        {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTransaction(tx.id)}
                        title="Delete transaction"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
