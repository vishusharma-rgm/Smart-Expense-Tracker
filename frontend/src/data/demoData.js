const now = new Date();

const daysAgo = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const demoExpenses = [
  { _id: "demo-exp-1", title: "Groceries", amount: 1890, category: "Food", date: daysAgo(1), createdAt: daysAgo(1) },
  { _id: "demo-exp-2", title: "Uber", amount: 420, category: "Transport", date: daysAgo(2), createdAt: daysAgo(2) },
  { _id: "demo-exp-3", title: "Rent", amount: 12000, category: "Housing", date: daysAgo(4), createdAt: daysAgo(4) },
  { _id: "demo-exp-4", title: "Coffee", amount: 180, category: "Food", date: daysAgo(0), createdAt: daysAgo(0) },
  { _id: "demo-exp-5", title: "Internet", amount: 999, category: "Utilities", date: daysAgo(6), createdAt: daysAgo(6) },
  { _id: "demo-exp-6", title: "Gym", amount: 1499, category: "Health", date: daysAgo(7), createdAt: daysAgo(7) }
];

export const demoIncomes = [
  { _id: "demo-inc-1", source: "Salary", amount: 85000, date: daysAgo(5), createdAt: daysAgo(5) },
  { _id: "demo-inc-2", source: "Freelance", amount: 15000, date: daysAgo(2), createdAt: daysAgo(2) },
  { _id: "demo-inc-3", source: "Bonus", amount: 8000, date: daysAgo(1), createdAt: daysAgo(1) }
];

export const demoBudget = {
  limit: 50000,
  effectiveLimit: 50000,
  carriedOver: 2000,
  categoryLimits: {
    Food: 8000,
    Transport: 3000,
    Housing: 15000,
    Utilities: 4000
  },
  rolloverEnabled: true,
  history: [
    { month: "Dec", limit: 42000, spent: 36000 },
    { month: "Jan", limit: 45000, spent: 39000 }
  ]
};
