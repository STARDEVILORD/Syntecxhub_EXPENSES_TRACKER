// App.jsx
import React from "react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import StatsPanel from "./components/StatsPanel";
import ExpenseList from "./components/ExpenseList";
import "./App.css";

export default function App() {
  const {
    expenses,
    stats,
    loading,
    adding,
    error,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    handleAdd,
    handleDelete,
  } = useExpenses();

  return (
    <div className="app">
      {/* Background grid */}
      <div className="bg-grid" aria-hidden="true" />

      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">₹</span>
            <div>
              <span className="logo-title">Spendwise</span>
              <span className="logo-sub">Expense Tracker</span>
            </div>
          </div>
          <div className="header-badge">
            {loading ? "Loading…" : `${stats.count} records`}
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          ⚠ {error}
        </div>
      )}

      <main className="app-main">
        <aside className="sidebar">
          <ExpenseForm onAdd={handleAdd} adding={adding} />
          {!loading && <StatsPanel stats={stats} />}
        </aside>

        <section className="content">
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onDelete={handleDelete}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </section>
      </main>

      <footer className="app-footer">
        Built with React · useState · useEffect · useRef · useMemo · useCallback
      </footer>
    </div>
  );
}
