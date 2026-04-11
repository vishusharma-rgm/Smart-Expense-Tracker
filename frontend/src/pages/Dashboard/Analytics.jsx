import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExpenses } from "../../context/ExpenseContext";
import { useBudget } from "../../context/BudgetContext";
import { exportExpensesToCSV } from "../../utils/exportCSV";
import { formatCurrency } from "../../utils/formatters";

const CATEGORY_ORDER = ["Food", "Travel", "Housing", "Shopping", "Other"];

const normalizeDate = (value, fallback) => {
  const date = new Date(value || fallback || Date.now());
  const year = date.getFullYear();
  if (Number.isNaN(date.getTime()) || year < 2000 || year > 2100) {
    return new Date(fallback || Date.now());
  }
  return date;
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function Analytics() {
  const { expenses } = useExpenses();
  const { budget } = useBudget();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const normalizedExpenses = useMemo(
    () =>
      expenses.map((expense) => ({
        ...expense,
        amount: Number(expense.amount || 0),
        normalizedDate: normalizeDate(expense.date, expense.createdAt),
      })),
    [expenses]
  );

  const filteredExpenses = useMemo(
    () =>
      normalizedExpenses.filter((expense) => {
        const matchesSearch = (expense.title || "")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "All" || (expense.category || "Other") === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [categoryFilter, normalizedExpenses, search]
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const thisWeekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()));
  const previousWeekStart = new Date(thisWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const categoryBreakdown = useMemo(() => {
    const totals = filteredExpenses.reduce((acc, expense) => {
      const key = expense.category || "Other";
      acc[key] = (acc[key] || 0) + expense.amount;
      return acc;
    }, {});

    return CATEGORY_ORDER.filter((category) => totals[category] > 0).map((category) => ({
      name: category,
      value: totals[category],
    }));
  }, [filteredExpenses]);

  const monthlyTrend = useMemo(() => {
    const buckets = new Map();

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(currentYear, currentMonth - index, 1);
      buckets.set(monthKey(date), {
        label: date.toLocaleString("en-IN", { month: "short" }),
        total: 0,
      });
    }

    filteredExpenses.forEach((expense) => {
      const key = monthKey(expense.normalizedDate);
      if (buckets.has(key)) {
        buckets.get(key).total += expense.amount;
      }
    });

    return Array.from(buckets.values());
  }, [currentMonth, currentYear, filteredExpenses]);

  const thisMonthTotal = useMemo(
    () =>
      filteredExpenses
        .filter(
          (expense) =>
            expense.normalizedDate.getMonth() === currentMonth &&
            expense.normalizedDate.getFullYear() === currentYear
        )
        .reduce((sum, expense) => sum + expense.amount, 0),
    [currentMonth, currentYear, filteredExpenses]
  );

  const lastMonthTotal = useMemo(
    () =>
      filteredExpenses
        .filter(
          (expense) =>
            expense.normalizedDate >= lastMonthStart &&
            expense.normalizedDate < currentMonthStart
        )
        .reduce((sum, expense) => sum + expense.amount, 0),
    [currentMonthStart, filteredExpenses, lastMonthStart]
  );

  const thisWeekTotal = useMemo(
    () =>
      filteredExpenses
        .filter((expense) => expense.normalizedDate >= thisWeekStart)
        .reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses, thisWeekStart]
  );

  const previousWeekTotal = useMemo(
    () =>
      filteredExpenses
        .filter(
          (expense) =>
            expense.normalizedDate >= previousWeekStart &&
            expense.normalizedDate < thisWeekStart
        )
        .reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses, previousWeekStart, thisWeekStart]
  );

  const topCategory = categoryBreakdown[0]
    ? [...categoryBreakdown].sort((a, b) => b.value - a.value)[0]
    : null;
  const avgDailySpend = thisMonthTotal / Math.max(now.getDate(), 1);
  const recentMonths = monthlyTrend.map((item) => item.total).filter((value) => value > 0);
  const forecastNextMonth = recentMonths.length
    ? Math.round(recentMonths.reduce((sum, value) => sum + value, 0) / recentMonths.length)
    : 0;
  const weeklyDelta = thisWeekTotal - previousWeekTotal;
  const weeklyDeltaPct = previousWeekTotal > 0 ? Math.round((weeklyDelta / previousWeekTotal) * 100) : 0;
  const budgetUsage = budget > 0 ? Math.round((thisMonthTotal / budget) * 100) : 0;
  const budgetSignal =
    budget <= 0
      ? "Set a budget to unlock overspending alerts."
      : budgetUsage >= 100
        ? "Budget exceeded. Slow discretionary spending this week."
        : budgetUsage >= 85
          ? "You are close to budget. Track food and shopping carefully."
          : "Budget pacing is healthy for the current month.";

  const hasCategoryData = categoryBreakdown.length > 0;
  const chartTooltip = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    borderRadius: "12px",
    boxShadow: "0 10px 24px var(--shadow-color)",
  };

  const getBarColor = (value) => {
    if (value >= 20000) return "#f97316";
    if (value >= 10000) return "#38bdf8";
    return "#22c55e";
  };

  return (
    <div className="space-y-8 p-6">
      <div className="surface surface-tint-1 p-6 flex flex-col gap-4 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">Analytics</p>
            <h1 className="text-3xl font-semibold text-primary">Financial Signals</h1>
            <p className="text-sm text-secondary mt-1">
              This page turns transactions into trend movement, budget risk, and category concentration.
            </p>
          </div>

          <button
            onClick={() => exportExpensesToCSV(filteredExpenses)}
            className="btn-primary btn-premium btn-luxe transition"
          >
            Export CSV
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-[color:var(--border-color)] pt-4">
          <MetricCard label="This Month" value={formatCurrency(thisMonthTotal)} tone="surface-tint-2" />
          <MetricCard label="Avg / Day" value={formatCurrency(avgDailySpend)} tone="surface-tint-3" />
          <MetricCard label="Forecast" value={formatCurrency(forecastNextMonth)} tone="surface-tint-4" />
          <MetricCard
            label="Budget Usage"
            value={budget > 0 ? `${budgetUsage}%` : "Not set"}
            tone="surface-tint-5"
          />
        </div>
      </div>

      <div className="surface surface-tint-6 p-6 rounded-2xl flex flex-col gap-4 lg:flex-row">
        <input
          type="text"
          placeholder="Search expense..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="border px-3 py-2 rounded w-full bg-transparent text-primary placeholder:text-secondary"
        />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="border px-3 py-2 rounded bg-transparent text-primary"
        >
          <option value="All">All</option>
          {CATEGORY_ORDER.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface surface-tint-2 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Monthly Trend</h2>
            <span className="text-xs text-secondary uppercase tracking-[0.2em]">6 months</span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid stroke="#1f2a3d" strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="label" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={chartTooltip} />
              <Bar dataKey="total" radius={[12, 12, 8, 8]} animationDuration={900}>
                {monthlyTrend.map((entry) => (
                  <Cell key={entry.label} fill={getBarColor(entry.total)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="surface surface-tint-3 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Category Breakdown</h2>
            <span className="text-xs text-secondary uppercase tracking-[0.2em]">share</span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={hasCategoryData ? categoryBreakdown : [{ name: "No data", value: 1 }]}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                label={({ name, value }) => (hasCategoryData ? `${name} ${formatCurrency(value)}` : "")}
              >
                {(hasCategoryData ? categoryBreakdown : [{ name: "No data", value: 1 }]).map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.name === "No data"
                        ? "#334155"
                        : getBarColor(entry.value)
                    }
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltip} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: "var(--text-secondary)" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InsightCard
          title="Weekly Delta"
          eyebrow="Momentum"
          body={
            previousWeekTotal > 0
              ? `${weeklyDelta >= 0 ? "Up" : "Down"} ${Math.abs(weeklyDeltaPct)}% vs last week`
              : "Need more weekly data for comparison"
          }
          detail={`This week: ${formatCurrency(thisWeekTotal)} | Last week: ${formatCurrency(previousWeekTotal)}`}
        />
        <InsightCard
          title="Top Category"
          eyebrow="Concentration"
          body={topCategory ? `${topCategory.name} is leading spend.` : "No dominant category yet."}
          detail={topCategory ? formatCurrency(topCategory.value) : "Add more expenses to unlock this signal."}
        />
        <InsightCard
          title="Budget Signal"
          eyebrow="Risk"
          body={budgetSignal}
          detail={budget > 0 ? `Budget: ${formatCurrency(budget)}` : "No monthly budget configured."}
        />
      </div>

      <div className="surface surface-tint-4 p-6 rounded-2xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-semibold text-primary">Summary</h2>
          <span className="text-sm text-secondary">
            {filteredExpenses.length} filtered transactions
          </span>
        </div>
        <div className="mt-4 space-y-3 text-sm text-secondary border-t border-[color:var(--border-color)] pt-4">
          <p>Trend, forecast, weekly movement, and budget pacing are shown in one place.</p>
          <p>Merchant names map into likely categories before the expense is saved.</p>
          <p>CSV export is still available when raw data is needed.</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <div className={`surface-muted ${tone} p-4 rounded-2xl`}>
      <p className="text-xs text-secondary uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-semibold text-primary mt-2">
        <span data-amount>{value}</span>
      </p>
    </div>
  );
}

function InsightCard({ eyebrow, title, body, detail }) {
  return (
    <div className="surface surface-tint-5 p-5 rounded-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
      <h3 className="text-lg font-semibold text-primary mt-2">{title}</h3>
      <p className="text-sm text-primary mt-3">{body}</p>
      <p className="text-xs text-secondary mt-3">{detail}</p>
    </div>
  );
}
