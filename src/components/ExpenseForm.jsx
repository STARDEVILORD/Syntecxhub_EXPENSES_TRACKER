import React, { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "../hooks/useExpenses";

const EMPTY_FORM = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
};

export default function ExpenseForm({ onAdd, adding }) {
  // useState — controlled form inputs
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  // useRef — focus management on mount and after submit
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        titleRef.current?.focus();
        return;
      }
      await onAdd({ ...form, amount: parseFloat(form.amount) });
      setForm(EMPTY_FORM);
      setErrors({});
      titleRef.current?.focus();
    },
    [form, validate, onAdd],
  );

  return (
    <form
      className={`expense-form ${shake ? "shake" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-header">
        <span className="form-icon">＋</span>
        <h2>Add Expense</h2>
      </div>

      <div className="form-grid">
        <div className={`field ${errors.title ? "field--error" : ""}`}>
          <label>Title</label>
          <input
            ref={titleRef}
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Grocery Shopping"
            autoComplete="off"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className={`field ${errors.amount ? "field--error" : ""}`}>
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.amount && (
            <span className="field-error">{errors.amount}</span>
          )}
        </div>

        <div className="field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={`field ${errors.date ? "field--error" : ""}`}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={adding}>
        {adding ? (
          <span className="btn-loading">
            <span className="spinner" /> Adding…
          </span>
        ) : (
          "Add Expense"
        )}
      </button>
    </form>
  );
}
