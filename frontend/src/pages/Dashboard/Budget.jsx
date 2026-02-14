// export default function Budget() {
//   return (
//     <div className="bg-white p-8 rounded-xl border">
//       <h1 className="text-xl font-semibold mb-4">
//         Budget Management
//       </h1>

//       <p className="text-gray-500">
//         Budget module coming next.
//       </p>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useBudget } from "../../context/BudgetContext";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/formatters";

const SETTINGS_KEY = "app_settings";

export default function Budget() {
  const {
    budget,
    baseLimit,
    carriedOver,
    categoryLimits,
    rolloverEnabled,
    history,
    saveBudget,
    loading,
    error
  } = useBudget();
  const { expenses } = useExpenses();
  const [limit, setLimit] = useState("");
  const [localCategoryLimits, setLocalCategoryLimits] = useState({});
  const [rollover, setRollover] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    alertsBudget80: true,
    alertsBudget90: true
  });

  const totalSpent = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();
    return expenses.reduce((sum, exp) => {
      const d = new Date(exp.date || exp.createdAt || Date.now());
      if (d.getMonth() === m && d.getFullYear() === y) {
        return sum + Number(exp.amount || 0);
      }
      return sum;
    }, 0);
  }, [expenses]);

  const remaining = Math.max(Number(budget || 0) - totalSpent, 0);
  const percentUsed =
    budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isWarning = percentUsed >= 80;
  const isCritical = percentUsed >= 90;

  const categories = ["Food", "Travel", "Housing", "Shopping", "Other"];

  const categorySpend = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();
    const map = {};
    categories.forEach((c) => {
      map[c] = 0;
    });
    expenses.forEach((exp) => {
      const rawDate = exp.date || exp.createdAt || Date.now();
      let d = new Date(rawDate);
      const year = d.getFullYear();
      if (Number.isNaN(d.getTime()) || year < 2000 || year > 2100) {
        d = new Date(exp.createdAt || Date.now());
      }
      if (d.getMonth() === m && d.getFullYear() === y) {
        const cat = exp.category || "Other";
        map[cat] = (map[cat] || 0) + Number(exp.amount || 0);
      }
    });
    return map;
  }, [expenses]);

  const trendData = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        label: d.toLocaleString("en-IN", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        total: 0,
      });
    }
    expenses.forEach((exp) => {
      const rawDate = exp.date || exp.createdAt || Date.now();
      let d = new Date(rawDate);
      const year = d.getFullYear();
      if (Number.isNaN(d.getTime()) || year < 2000 || year > 2100) {
        d = new Date(exp.createdAt || Date.now());
      }
      const bucket = buckets.find(
        (b) => b.month === d.getMonth() && b.year === d.getFullYear()
      );
      if (bucket) bucket.total += Number(exp.amount || 0);
    });
    const max = Math.max(...buckets.map((b) => b.total), 1);
    return { buckets, max };
  }, [expenses]);

  const presets = [5000, 10000, 20000, 30000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericLimit = Number(limit);
    if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
      return;
    }
    setSaving(true);
    await saveBudget({
      limit: numericLimit,
      categoryLimits: localCategoryLimits,
      rolloverEnabled: rollover
    });
    setSaving(false);
    setLimit("");
  };

  const handleExport = () => {
    const rows = [
      ["Budget Report"],
      ["Base Limit", baseLimit || 0],
      ["Carried Over", carriedOver || 0],
      ["Effective Limit", budget || 0],
      ["Spent This Month", totalSpent],
      ["Remaining", remaining],
      [""],
      ["Category Limits", "Spent"],
      ...categories.map((c) => [
        c,
        Number(localCategoryLimits[c] || categoryLimits?.[c] || 0),
        categorySpend[c] || 0
      ]),
      [""],
      ["History (Most Recent 5)"],
      ["Date", "Limit", "Carried Over", "Rollover"],
      ...history.slice(-5).reverse().map((h) => [
        new Date(h.date).toLocaleString(),
        h.limit || 0,
        h.carriedOver || 0,
        h.rolloverEnabled ? "Yes" : "No"
      ])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "budget-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (Object.keys(categoryLimits || {}).length) {
      setLocalCategoryLimits(categoryLimits);
    }
    if (typeof rolloverEnabled === "boolean") {
      setRollover(rolloverEnabled);
    }
    if (!limit && baseLimit) {
      setLimit(String(baseLimit));
    }
  }, [categoryLimits, rolloverEnabled, baseLimit, limit]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (stored) {
      setSettings((s) => ({
        ...s,
        alertsBudget80: stored.alertsBudget80 ?? s.alertsBudget80,
        alertsBudget90: stored.alertsBudget90 ?? s.alertsBudget90
      }));
    }
  }, []);

  return (
    <div className="space-y-6 w-full">
      {isCritical && settings.alertsBudget90 && (
        <div className="surface surface-tint-6 p-4 rounded-xl border border-red-300/50">
          <p className="text-sm text-red-600">
            Alert: You have used over 90% of your monthly budget.
          </p>
        </div>
      )}
      {isWarning && !isCritical && settings.alertsBudget80 && (
        <div className="surface surface-tint-5 p-4 rounded-xl border border-amber-300/50">
          <p className="text-sm text-amber-600">
            Warning: You have used over 80% of your monthly budget.
          </p>
        </div>
      )}

      <div className="surface surface-tint-1 p-8 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">
              Budget
            </p>
            <h2 className="text-xl font-semibold">
              Set Monthly Budget
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary">Current Budget</p>
            <p className="text-xl font-semibold text-primary">
              {formatCurrency(Number(budget || 0))}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            min="1"
            required
          />

          <div className="flex flex-wrap gap-2">
            {presets.map((value) => (
              <button
                key={value}
                type="button"
                className="btn-ghost px-3 py-2 text-sm"
                onClick={() => setLimit(String(value))}
              >
                {formatCurrency(value)}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              checked={rollover}
              onChange={(e) => setRollover(e.target.checked)}
            />
            Enable rollover to next month
          </label>

          <button
            className="btn-primary btn-premium btn-luxe transition w-full"
            disabled={saving || loading}
          >
            {saving || loading ? "Saving..." : "Save Budget"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="surface surface-tint-2 p-6 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="surface-muted surface-tint-3 p-4 rounded-xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Spent
            </p>
            <p className="text-2xl font-semibold text-primary mt-2">
              <span data-amount>{formatCurrency(totalSpent)}</span>
            </p>
          </div>
          <div className="surface-muted surface-tint-4 p-4 rounded-xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Remaining
            </p>
            <p className="text-2xl font-semibold text-primary mt-2">
              <span data-amount>{formatCurrency(remaining)}</span>
            </p>
          </div>
          <div className="surface-muted surface-tint-5 p-4 rounded-xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Used
            </p>
            <p className={`text-2xl font-semibold mt-2 ${isWarning ? "text-red-500" : "text-primary"}`}>
              {Math.round(percentUsed)}%
            </p>
          </div>
          <div className="surface-muted surface-tint-6 p-4 rounded-xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Carried Over
            </p>
            <p className="text-2xl font-semibold text-primary mt-2">
              <span data-amount>{formatCurrency(Number(carriedOver || 0))}</span>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-secondary">Budget Utilization</p>
            {isWarning && (
              <span className="text-xs text-red-500">Warning: 80%+</span>
            )}
          </div>
          <div className="h-3 rounded-full bg-[color:var(--border-color)] overflow-hidden">
            <div
              className={`h-full ${isWarning ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
      </div>

      <div className="surface surface-tint-3 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Category Limits</h3>
          <button
            className="btn-ghost px-3 py-2 text-sm"
            onClick={handleExport}
            type="button"
          >
            Export Budget Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const limitValue =
              localCategoryLimits[cat] ?? categoryLimits?.[cat] ?? "";
            const spentValue = categorySpend[cat] || 0;
            const warn = limitValue && spentValue >= limitValue * 0.9;
            return (
              <div key={cat} className={`surface-muted ${["surface-tint-1","surface-tint-2","surface-tint-3","surface-tint-4","surface-tint-5"][categories.indexOf(cat) % 5]} p-4 rounded-xl`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{cat}</p>
                  <span className={`text-xs ${warn ? "text-red-500" : "text-secondary"}`}>
                    Spent <span data-amount>{formatCurrency(spentValue)}</span>
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    placeholder="Limit"
                    value={limitValue}
                    onChange={(e) =>
                      setLocalCategoryLimits((prev) => ({
                        ...prev,
                        [cat]: Number(e.target.value || 0)
                      }))
                    }
                    className="w-full border px-3 py-2 rounded"
                    min="0"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="surface surface-tint-4 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Monthly Trend</h3>
          <span className="text-xs text-secondary uppercase tracking-[0.2em]">
            Last 6 Months
          </span>
        </div>
        <div className="flex items-end gap-3 h-28">
          {trendData.buckets.map((b) => (
            <div key={`${b.label}-${b.year}`} className="flex-1">
              <div className="h-20 flex items-end">
                <div
                  className="w-full rounded-md"
                  style={{
                    height: `${(b.total / trendData.max) * 100}%`,
                    minHeight: b.total > 0 ? "6px" : "2px",
                    background: b.total > 0 ? "var(--text-primary)" : "var(--border-color)",
                    opacity: b.total > 0 ? 0.8 : 0.6,
                  }}
                  title={formatCurrency(Math.round(b.total))}
                />
              </div>
              <p className="mt-2 text-xs text-secondary text-center">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface surface-tint-5 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit History</h3>
          <span className="text-xs text-secondary uppercase tracking-[0.2em]">
            Last 5 Changes
          </span>
        </div>
        {history?.length ? (
          <div className="space-y-3">
            {history.slice(-5).reverse().map((h, idx) => (
              <div key={`${h.date}-${idx}`} className="flex items-center justify-between text-sm">
                <span className="text-secondary">
                  {new Date(h.date).toLocaleString()}
                </span>
                <span className="text-primary">
                  {formatCurrency(Number(h.limit || 0))} {h.rolloverEnabled ? "(Rollover)" : ""}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-secondary">No changes yet.</p>
        )}
      </div>
    </div>
  );
}
