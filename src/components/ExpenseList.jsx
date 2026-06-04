import React, { useCallback } from "react";
import { CATEGORIES, CATEGORY_COLORS } from "../hooks/useExpenses";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ExpenseList({
  expenses,
  loading,
  onDelete,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
}) {
  const handleCatFilter = useCallback(
    (cat) => setFilterCategory(cat),
    [setFilterCategory],
  );

  if (loading) {
    return (
      <div className="list-loading">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="skeleton-row"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="expense-list">
      {/* Controls */}
      <div className="list-controls">
        <div className="filter-chips">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`chip ${filterCategory === cat ? "chip--active" : ""}`}
              style={
                filterCategory === cat && cat !== "All"
                  ? {
                      background: CATEGORY_COLORS[cat],
                      borderColor: CATEGORY_COLORS[cat],
                    }
                  : {}
              }
              onClick={() => handleCatFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="sort-toggle">
          <button
            className={`sort-btn ${sortBy === "date" ? "sort-btn--active" : ""}`}
            onClick={() => setSortBy("date")}
          >
            Latest
          </button>
          <button
            className={`sort-btn ${sortBy === "amount" ? "sort-btn--active" : ""}`}
            onClick={() => setSortBy("amount")}
          >
            Highest
          </button>
        </div>
      </div>

      {/* List */}
      {expenses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🪙</span>
          <p>No expenses found.</p>
        </div>
      ) : (
        <ul className="expense-items">
          {expenses.map((exp) => (
            <li key={exp.id} className="expense-item">
              <div
                className="item-dot"
                style={{
                  background: CATEGORY_COLORS[exp.category] || "#6b7280",
                }}
              />
              <div className="item-info">
                <span className="item-title">{exp.title}</span>
                <span className="item-meta">
                  <span
                    className="item-cat"
                    style={{ color: CATEGORY_COLORS[exp.category] }}
                  >
                    {exp.category}
                  </span>
                  <span className="item-date">{fmtDate(exp.date)}</span>
                </span>
              </div>
              <div className="item-right">
                <span className="item-amount">{fmt(exp.amount)}</span>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(exp.id)}
                  aria-label="Delete"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
