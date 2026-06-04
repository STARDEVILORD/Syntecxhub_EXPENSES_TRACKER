// mockApi.js — simulates a backend with artificial delay

const MOCK_EXPENSES = [
  { id: 1, title: "Grocery Shopping", amount: 1240.5, category: "Food", date: "2025-05-28" },
  { id: 2, title: "Electric Bill", amount: 3200.0, category: "Utilities", date: "2025-05-25" },
  { id: 3, title: "Gym Membership", amount: 999.0, category: "Health", date: "2025-05-22" },
  { id: 4, title: "Netflix Subscription", amount: 499.0, category: "Entertainment", date: "2025-05-20" },
  { id: 5, title: "Petrol", amount: 1800.0, category: "Transport", date: "2025-05-18" },
  { id: 6, title: "Restaurant Dinner", amount: 2100.0, category: "Food", date: "2025-05-15" },
  { id: 7, title: "Internet Bill", amount: 699.0, category: "Utilities", date: "2025-05-12" },
  { id: 8, title: "New Shoes", amount: 3500.0, category: "Shopping", date: "2025-05-10" },
];

let nextId = MOCK_EXPENSES.length + 1;
let store = [...MOCK_EXPENSES];

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

export const fetchExpenses = async () => {
  await delay();
  return [...store];
};

export const addExpense = async (expense) => {
  await delay(400);
  const newExpense = { ...expense, id: nextId++ };
  store = [newExpense, ...store];
  return newExpense;
};

export const deleteExpense = async (id) => {
  await delay(300);
  store = store.filter((e) => e.id !== id);
  return id;
};
