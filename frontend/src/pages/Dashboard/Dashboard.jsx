
import { useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { useBudget } from "../../context/BudgetContext";
import AddExpense from "../Expenses/AddExpense";
import AddIncome from "../Income/AddIncome";
import IncomeList from "../Income/IncomeList";
import ExpenseList from "../Expenses/ExpenseList";
import api from "../../services/api";
import { formatCurrency, formatDate } from "../../utils/formatters";
import GlassyCalendarIcon from "../../components/ui/GlassyCalendarIcon";
import { exportExpensesToCSV } from "../../utils/exportCSV";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

export default function Dashboard() {
  const { expenses, fetchExpenses, addExpense } = useExpenses();
  const { incomes, fetchIncome } = useIncome();
  const { budget, fetchBudget } = useBudget();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [simBudget, setSimBudget] = useState(0);
  const [listening, setListening] = useState(false);
  const isDemo = localStorage.getItem("demo_mode") === "true";

  /* ---------------- TOTALS ---------------- */

  const totalIncome = useMemo(() => {
    return incomes.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [incomes]);

  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [expenses]);

  const netBalance = totalIncome - totalExpense;

  /* ---------------- TOP CATEGORY ---------------- */

  const topCategory = useMemo(() => {
    if (!expenses.length) return null;

    const map = {};

    expenses.forEach((exp) => {
      const cat = exp.category || "Other";
      map[cat] = (map[cat] || 0) + Number(exp.amount || 0);
    });

    let max = 0;
    let top = null;

    for (let cat in map) {
      if (map[cat] > max) {
        max = map[cat];
        top = cat;
      }
    }

    return top ? { name: top, amount: max } : null;
  }, [expenses]);

  /* ---------------- FORECAST ---------------- */

  const forecast = useMemo(() => {
    if (!expenses.length) return 0;
    return Math.round(totalExpense * 1.1); // slight projection logic
  }, [totalExpense, expenses]);

  /* ---------------- SAFE BUDGET ---------------- */

  const remaining =
    typeof budget === "number" && !isNaN(budget)
      ? budget - totalExpense
      : 0;

  const simulated = useMemo(() => {
    const b = Number(simBudget || 0);
    const remain = b - totalExpense;
    const rate = b > 0 ? Math.round((remain / b) * 100) : 0;
    return { remain, rate };
  }, [simBudget, totalExpense]);

  const alerts = useMemo(() => {
    const list = [];
    if (budget > 0 && totalExpense / budget >= 0.9) {
      list.push("Budget alert: 90%+ used.");
    } else if (budget > 0 && totalExpense / budget >= 0.8) {
      list.push("Budget warning: 80%+ used.");
    }
    const today = new Date();
    const todaySpend = expenses
      .filter((e) => {
        const d = new Date(e.date || e.createdAt || Date.now());
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const last7 = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      last7.push(
        expenses
          .filter((e) => {
            const ed = new Date(e.date || e.createdAt || Date.now());
            return (
              ed.getFullYear() === d.getFullYear() &&
              ed.getMonth() === d.getMonth() &&
              ed.getDate() === d.getDate()
            );
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0)
      );
    }
    const avg = last7.reduce((a, b) => a + b, 0) / (last7.length || 1);
    if (todaySpend > avg * 2 && todaySpend > 0) {
      list.push("Unusual spend today detected.");
    }
    return list;
  }, [budget, totalExpense, expenses]);

  const cashflow = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const income = incomes
      .filter((i) => {
        const d = new Date(i.date || i.createdAt || Date.now());
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const expense = expenses
      .filter((e) => {
        const d = new Date(e.date || e.createdAt || Date.now());
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return { income, expense };
  }, [incomes, expenses]);

  const insights = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    let thisMonth = 0;
    let lastMonth = 0;

    const byCategory = {};
    const byMerchant = {};
    const dailyTotals = {};

    expenses.forEach((e) => {
      const d = new Date(e.date || e.createdAt || Date.now());
      if (Number.isNaN(d.getTime())) return;
      const amt = Number(e.amount || 0);
      const cat = e.category || "Other";
      const merchant = (e.title || "Unknown").toLowerCase().trim();
      const dayKey = d.toISOString().slice(0, 10);

      byCategory[cat] = (byCategory[cat] || 0) + amt;
      byMerchant[merchant] = (byMerchant[merchant] || 0) + amt;
      dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + amt;

      if (d.getMonth() === month && d.getFullYear() === year) {
        thisMonth += amt;
      }
      const lastMonthDate = new Date(year, month - 1, 1);
      if (d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear()) {
        lastMonth += amt;
      }
    });

    const categoryTop = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const merchantTop = Object.entries(byMerchant).sort((a, b) => b[1] - a[1])[0];

    const dailyValues = Object.values(dailyTotals);
    const avgDaily =
      dailyValues.length > 0
        ? dailyValues.reduce((s, v) => s + v, 0) / dailyValues.length
        : 0;
    const spike = dailyValues.find((v) => v > avgDaily * 2);

    const delta =
      lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

    const bullets = [];
    if (lastMonth > 0) {
      bullets.push(`This month is ${delta >= 0 ? "+" : ""}${delta}% vs last month.`);
    }
    if (categoryTop) {
      bullets.push(`Top category: ${categoryTop[0]} (${formatCurrency(categoryTop[1])}).`);
    }
    if (merchantTop) {
      bullets.push(`Top merchant: ${merchantTop[0]} (${formatCurrency(merchantTop[1])}).`);
    }
    if (spike) {
      bullets.push(`Unusual spike day: ${formatCurrency(spike)} vs avg ${formatCurrency(avgDaily)}.`);
    }
    if (bullets.length === 0) {
      bullets.push("Add some expenses to unlock insights.");
      bullets.push("Tip: add last month entries to compare trends.");
      bullets.push("Tip: spread expenses across days to detect spikes.");
    }
    return bullets.slice(0, 3);
  }, [expenses]);

  const last7Trend = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const label = d.toLocaleString("en-IN", { weekday: "short" });
      const total = expenses
        .filter((e) => {
          const ed = new Date(e.date || e.createdAt || Date.now());
          return (
            ed.getFullYear() === d.getFullYear() &&
            ed.getMonth() === d.getMonth() &&
            ed.getDate() === d.getDate()
          );
        })
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      data.push({ day: label, value: total });
    }
    return data;
  }, [expenses]);

  const categorySplit = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 5);
  }, [expenses]);

  const topMerchants = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const key = (e.title || "Unknown").toLowerCase().trim();
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map)
      .map(([merchant, total]) => ({ merchant, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [expenses]);

  const goals = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("goals") || "[]");
    } catch {
      return [];
    }
  }, []);

  const bills = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("bill_calendar_items") || "[]");
    } catch {
      return [];
    }
  }, []);

  const upcomingBills = useMemo(() => {
    const now = new Date();
    return bills
      .map((b) => ({ ...b, due: new Date(b.dueDate) }))
      .filter((b) => b.due >= now)
      .sort((a, b) => a.due - b.due)
      .slice(0, 4);
  }, [bills]);

  useMemo(() => {
    if (!simBudget && budget) setSimBudget(budget);
  }, [simBudget, budget]);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8 min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-[#0f172a] p-6 rounded-2xl">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Money, This Month
          </h1>
          <p className="text-sm text-secondary">
            Quick view of today’s spend and monthly progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="surface surface-tint-2 px-4 py-2 rounded-xl text-sm">
            <span className="text-secondary">Today</span>
            <span className="ml-2 font-semibold text-primary">
              {formatCurrency(
                expenses
                .filter((e) => {
                  const d = new Date(e.date || e.createdAt || Date.now());
                  const now = new Date();
                  return (
                    d.getFullYear() === now.getFullYear() &&
                    d.getMonth() === now.getMonth() &&
                    d.getDate() === now.getDate()
                  );
                })
                .reduce((sum, e) => sum + Number(e.amount || 0), 0)
              )}
            </span>
          </div>
          <div className="surface surface-tint-3 px-4 py-2 rounded-xl text-sm">
            <span className="text-secondary">Month Used</span>
            <span className="ml-2 font-semibold text-primary">
              {budget > 0
                ? Math.min(
                    Math.round((totalExpense / budget) * 100),
                    100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="surface surface-tint-4 px-4 py-2 rounded-xl text-sm">
            <span className="text-secondary">Status</span>
            <span className="ml-2 font-semibold text-primary">
              {budget > 0
                ? totalExpense <= budget
                  ? "On Track"
                  : "Over Budget"
                : "No Budget"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn-ghost px-3 py-2 text-sm tab-hover"
            onClick={() => document.getElementById("add-expense")?.scrollIntoView({ behavior: "smooth" })}
          >
            Add Expense
          </button>
          <button
            className="btn-ghost px-3 py-2 text-sm tab-hover"
            onClick={() => document.getElementById("add-income")?.scrollIntoView({ behavior: "smooth" })}
          >
            Add Income
          </button>
          <button
            className="btn-ghost px-3 py-2 text-sm tab-hover"
            onClick={() => exportExpensesToCSV(expenses)}
          >
            Export
          </button>
          <button
            className="btn-voice px-4 py-2 text-sm tab-hover flex items-center gap-2"
            onClick={() => {
              const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) {
                alert("Voice input not supported in this browser.");
                return;
              }
              const recognition = new SpeechRecognition();
              recognition.lang = "en-IN";
              recognition.interimResults = false;
              recognition.maxAlternatives = 1;
              recognition.onstart = () => setListening(true);
              recognition.onend = () => setListening(false);
              recognition.onresult = (event) => {
                const text = event.results[0][0].transcript.toLowerCase();
                const amountMatch = text.match(/(\d+)/);
                const amount = amountMatch ? Number(amountMatch[1]) : 0;
                const titleMatch = text.match(/for (.*)/);
                const title = titleMatch ? titleMatch[1] : "Voice Expense";
                if (amount > 0) {
                  // quick add expense
                  addExpense({
                    title,
                    amount,
                    category: "Other",
                    date: new Date().toISOString()
                  }).then(() => fetchExpenses());
                }
              };
              recognition.start();
            }}
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/70 border border-white/60">
              🎙️
            </span>
            {listening ? "Listening..." : "Voice Add"}
          </button>
          <button
            onClick={async () => {
              const ok = window.confirm(
                "This will delete all your expenses, income, and budgets. Continue?"
              );
              if (!ok) return;
              try {
                setResetting(true);
                setResetMessage("");
                if (isDemo) {
                  await Promise.all([
                    fetchExpenses(),
                    fetchIncome(),
                    fetchBudget(),
                  ]);
                  setResetMessage("Demo data has been reset.");
                } else {
                  await api.post("/reset");
                  await Promise.all([
                    fetchExpenses(),
                    fetchIncome(),
                    fetchBudget(),
                  ]);
                  setResetMessage("All data has been reset.");
                }
              } catch (err) {
                setResetMessage(
                  err.response?.data?.message || "Reset failed. Try again."
                );
              } finally {
                setResetting(false);
              }
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={resetting}
          >
            {resetting ? "Resetting..." : "Reset All Data"}
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="surface-muted px-4 py-3 rounded-xl text-sm text-secondary">
          {resetMessage}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="surface surface-tint-3 p-4 rounded-2xl flex flex-wrap gap-2">
          {alerts.map((a, i) => (
            <span key={i} className="text-sm text-secondary">
              {a}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface surface-tint-2 p-6 rounded-2xl fade-rise">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cashflow (This Month)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="surface surface-tint-4 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Income</p>
              <p className="text-xl font-semibold text-primary mt-2">
                <span data-amount>{formatCurrency(cashflow.income)}</span>
              </p>
            </div>
            <div className="surface surface-tint-5 p-4 rounded-xl">
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">Expense</p>
              <p className="text-xl font-semibold text-primary mt-2">
                <span data-amount>{formatCurrency(cashflow.expense)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="surface surface-tint-6 p-6 rounded-2xl fade-rise">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Savings Meter</h3>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-secondary">No goals yet.</p>
          ) : (
            goals.slice(0, 1).map((g) => {
              const progress = g.target
                ? Math.min(((totalIncome - totalExpense) / g.target) * 100, 100)
                : 0;
              return (
                <div key={g.id}>
                  <p className="text-sm text-secondary">
                    {g.title} • <span data-amount>{formatCurrency(g.target)}</span>
                  </p>
                  <div className="h-2 rounded-full bg-[color:var(--border-color)] overflow-hidden mt-2">
                    <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-secondary mt-2">
                    Progress {Math.round(progress)}%
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="surface surface-tint-5 p-6 rounded-2xl fade-rise">
        <h3 className="text-lg font-semibold mb-4">Budget Simulator</h3>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={simBudget}
          onChange={(e) => setSimBudget(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-secondary">
          <span>Sim Budget: <span data-amount>{formatCurrency(simBudget)}</span></span>
          <span>Remaining: <span data-amount>{formatCurrency(simulated.remain)}</span></span>
          <span>Savings Rate: {simulated.rate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="surface surface-tint-1 p-6 rounded-2xl fade-rise">
          <h3 className="text-lg font-semibold mb-4">Mini Trend (7 days)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={last7Trend}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="surface surface-tint-2 p-6 rounded-2xl fade-rise">
          <h3 className="text-lg font-semibold mb-4">Category Split</h3>
          {categorySplit.length === 0 ? (
            <p className="text-sm text-secondary">No data found.</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categorySplit}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={60}
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                >
                  {categorySplit.map((_, i) => (
                    <Cell key={i} fill={["#22c55e", "#f59e0b", "#38bdf8", "#f97316", "#a78bfa"][i % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="surface surface-tint-3 p-6 rounded-2xl fade-rise">
          <h3 className="text-lg font-semibold mb-4">Top Merchants</h3>
          {topMerchants.length === 0 ? (
            <p className="text-sm text-secondary">No merchant data.</p>
          ) : (
            <div className="space-y-3">
              {topMerchants.map((m) => (
                <div key={m.merchant} className="flex items-center justify-between">
                  <span className="capitalize">{m.merchant}</span>
                  <span data-amount>{formatCurrency(m.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="surface surface-tint-4 p-6 rounded-2xl fade-rise">
        <div className="flex items-center gap-3 mb-4">
          <GlassyCalendarIcon size={28} />
          <h3 className="text-lg font-semibold">Calendar Strip</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {upcomingBills.length === 0 ? (
            <p className="text-sm text-secondary">No upcoming bills.</p>
          ) : (
            upcomingBills.map((b) => (
              <div key={b.id} className="surface surface-tint-5 p-3 rounded-xl">
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-secondary">
                  Due {formatDate(b.dueDate)}
                </p>
                <p className="text-xs text-secondary">
                  <span data-amount>{formatCurrency(b.amount)}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl fade-rise relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-300/30 blur-2xl" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm border border-white/60">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Smart Insights</h3>
              <p className="text-xs text-secondary">Personalized summary</p>
            </div>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">
            Premium
          </span>
        </div>
        <div className="grid gap-3 relative z-10">
          {insights.map((line, idx) => (
            <div key={idx} className="surface surface-tint-2 p-3 rounded-xl flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <p className="text-sm text-secondary">{line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-rise">

        <Card
          title="Total Income"
          value={formatCurrency(totalIncome)}
          color="text-green-500"
          tintClass="surface-tint-1 card-hover"
        />

        <Card
          title="Total Expense"
          value={formatCurrency(totalExpense)}
          color="text-red-500"
          tintClass="surface-tint-2 card-hover"
        />

        <Card
          title="Net Balance"
          value={formatCurrency(netBalance)}
          color={
            netBalance >= 0
              ? "text-green-500"
              : "text-red-500"
          }
          tintClass="surface-tint-3 card-hover"
        />

        <Card
          title="Top Spending Category"
          value={
            topCategory
              ? `${topCategory.name} — ${formatCurrency(topCategory.amount)}`
              : "None"
          }
          color="text-gray-900 dark:text-gray-100"
          tintClass="surface-tint-4 card-hover"
        />

        <Card
          title="Forecast Next Month"
          value={formatCurrency(forecast)}
          color="text-orange-500"
          tintClass="surface-tint-5 card-hover"
        />

        <Card
          title="Budget Remaining"
          value={formatCurrency(remaining)}
          color={
            remaining >= 0
              ? "text-green-500"
              : "text-red-500"
          }
          tintClass="surface-tint-6 card-hover"
        />
      </div>

      {/* FORMS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div id="add-expense" className="surface surface-tint-1 p-6 rounded-xl transition">
          <AddExpense />
        </div>

        <div className="space-y-6">
          <div id="add-income" className="surface surface-tint-2 p-6 rounded-xl transition">
            <AddIncome />
          </div>
          <IncomeList />
        </div>

      </div>

      {/* RECENT EXPENSES */}
      <div id="recent-expenses">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Expenses
        </h2>
        <ExpenseList />
      </div>

    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function Card({ title, value, color, tintClass }) {
  return (
    <div className={`surface ${tintClass} p-6 rounded-xl shadow-sm transition`}>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h2 className={`text-xl font-semibold mt-2 ${color}`}>
        <span data-amount>{value}</span>
      </h2>

    </div>
  );
}
