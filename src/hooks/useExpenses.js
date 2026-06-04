// hooks/useExpenses.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchExpenses, addExpense, deleteExpense } from "../mockApi";

export const CATEGORIES = [
  "Food",
  "Utilities",
  "Health",
  "Entertainment",
  "Transport",
  "Shopping",
  "Education",
  "Other",
];

export const CATEGORY_COLORS = {
  Food: "#f97316",
  Utilities: "#3b82f6",
  Health: "#22c55e",
  Entertainment: "#a855f7",
  Transport: "#eab308",
  Shopping: "#ec4899",
  Education: "#06b6d4",
  Other: "#6b7280",
};

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'amount'

  // useEffect — fetch from mock API on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchExpenses()
      .then((data) => {
        if (!cancelled) {
          setExpenses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // useCallback — stable reference for add handler
  const handleAdd = useCallback(async (formData) => {
    setAdding(true);
    try {
      const newExpense = await addExpense(formData);
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }, []);

  // useCallback — stable reference for delete handler
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // useMemo — derived/filtered/sorted list
  const displayedExpenses = useMemo(() => {
    let list = filterCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

    return [...list].sort((a, b) =>
      sortBy === "amount"
        ? b.amount - a.amount
        : new Date(b.date) - new Date(a.date)
    );
  }, [expenses, filterCategory, sortBy]);

  // useMemo — summary stats
  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const avgExpense = expenses.length ? total / expenses.length : 0;
    return { total, byCategory, topCategory, avgExpense, count: expenses.length };
  }, [expenses]);

  return {
    expenses: displayedExpenses,
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
  };
}
