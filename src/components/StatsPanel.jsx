import React, { useMemo } from "react";
import { CATEGORY_COLORS } from "../hooks/useExpenses";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function StatsPanel({ stats }) {
  const { total, byCategory, topCategory, avgExpense, count } = stats;

  // useMemo — compute bar widths only when byCategory changes
  const categoryBars = useMemo(() => {
    const max = Math.max(...Object.values(byCategory), 1);
    return Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => ({
        cat,
        amt,
        pct: Math.round((amt / max) * 100),
        color: CATEGORY_COLORS[cat] || "#6b7280",
      }));
  }, [byCategory]);

  return (
    <div className="stats-panel">
      <div className="stat-cards">
        <div className="stat-card stat-card--total">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">{fmt(total)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value">{count}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Expense</span>
          <span className="stat-value">{fmt(avgExpense)}</span>
        </div>
        {topCategory && (
          <div className="stat-card">
            <span className="stat-label">Top Category</span>
            <span
              className="stat-value stat-value--cat"
              style={{ color: CATEGORY_COLORS[topCategory[0]] }}
            >
              {topCategory[0]}
            </span>
          </div>
        )}
      </div>

      {categoryBars.length > 0 && (
        <div className="category-breakdown">
          <h3 className="breakdown-title">By Category</h3>
          <div className="bars">
            {categoryBars.map(({ cat, amt, pct, color }) => (
              <div key={cat} className="bar-row">
                <span className="bar-label">{cat}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className="bar-amount">{fmt(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
