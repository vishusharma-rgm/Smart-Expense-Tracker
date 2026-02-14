import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { formatCurrency, formatDate } from "../../utils/formatters";

const STORAGE_KEY = "goals";

export default function Goals() {
  const { expenses } = useExpenses();
  const { incomes } = useIncome();

  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    target: "",
    deadline: ""
  });

  const totalIncome = useMemo(
    () => incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [incomes]
  );
  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );
  const netBalance = Math.max(totalIncome - totalExpense, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setGoals(saved);
    } catch {
      setGoals([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();
    const target = Number(form.target);
    if (!form.title || !Number.isFinite(target) || target <= 0) return;
    setGoals((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        title: form.title,
        target,
        deadline: form.deadline || "",
      },
    ]);
    setForm({ title: "", target: "", deadline: "" });
  };

  const removeGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold text-primary">Goals</h1>
        <p className="text-sm text-secondary mt-1">
          Track savings targets and progress.
        </p>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl">
        <form onSubmit={addGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Goal title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Target amount"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
            className="border px-3 py-2 rounded"
            required
            min="1"
          />
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <button className="btn-primary btn-premium btn-luxe">Add Goal</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-rise">
        {goals.length === 0 ? (
          <div className="surface surface-tint-3 p-6 rounded-2xl">
            <p className="text-secondary">No goals yet.</p>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = goal.target
              ? Math.min((netBalance / goal.target) * 100, 100)
              : 0;
            const tint = `surface-tint-${(index % 6) + 1}`;
            return (
              <div key={goal.id} className={`surface ${tint} p-6 rounded-2xl`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-secondary">
                      Target <span data-amount>{formatCurrency(goal.target)}</span>
                    </p>
                    {goal.deadline && (
                      <p className="text-xs text-secondary mt-1">
                        Deadline: {formatDate(goal.deadline)}
                      </p>
                    )}
                  </div>
                  <button
                    className="btn-ghost px-2 py-1 text-xs"
                    onClick={() => removeGoal(goal.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[color:var(--border-color)] overflow-hidden mt-2">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary mt-2">
                    Based on current net balance <span data-amount>{formatCurrency(netBalance)}</span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
