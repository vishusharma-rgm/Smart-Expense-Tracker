import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { formatCurrency } from "../../utils/formatters";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DEBT_KEY = "lab_debts";
const VAULT_KEY = "lab_vault";
const SPLIT_KEY = "lab_split_groups";

export default function Lab() {
  const { expenses } = useExpenses();
  const { incomes } = useIncome();

  const [debts, setDebts] = useState([]);
  const [debtForm, setDebtForm] = useState({
    name: "",
    principal: "",
    rate: "",
    emi: "",
  });

  const [vault, setVault] = useState({
    lockedGoal: "",
    target: "",
    rulePercent: "10",
  });

  const [groups, setGroups] = useState([]);
  const [groupForm, setGroupForm] = useState({
    name: "",
    amount: "",
    members: "",
  });

  useEffect(() => {
    setDebts(JSON.parse(localStorage.getItem(DEBT_KEY) || "[]"));
    setVault(
      JSON.parse(localStorage.getItem(VAULT_KEY) || "null") || {
        lockedGoal: "",
        target: "",
        rulePercent: "10",
      }
    );
    setGroups(JSON.parse(localStorage.getItem(SPLIT_KEY) || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem(DEBT_KEY, JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  }, [vault]);

  useEffect(() => {
    localStorage.setItem(SPLIT_KEY, JSON.stringify(groups));
  }, [groups]);

  const netIncome = useMemo(() => {
    const totalIncome = incomes.reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0
    );
    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    return Math.max(totalIncome - totalExpense, 0);
  }, [incomes, expenses]);

  const merchantInsights = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const key = (e.title || "Unknown").trim().toLowerCase();
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    });
    const top = Object.entries(map)
      .map(([k, v]) => ({ merchant: k, total: v }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("en-IN", { month: "short" }),
        total: 0,
      });
    }
    expenses.forEach((e) => {
      const d = new Date(e.date || e.createdAt || Date.now());
      const idx =
        (d.getFullYear() - now.getFullYear()) * 12 +
        (d.getMonth() - now.getMonth()) +
        5;
      if (idx >= 0 && idx < months.length) {
        months[idx].total += Number(e.amount || 0);
      }
    });
    return { top, months };
  }, [expenses]);

  const addDebt = (e) => {
    e.preventDefault();
    const principal = Number(debtForm.principal);
    const rate = Number(debtForm.rate);
    const emi = Number(debtForm.emi);
    if (!debtForm.name || !principal || !emi) return;
    setDebts((prev) => [
      ...prev,
      { id: `${Date.now()}`, ...debtForm, principal, rate, emi },
    ]);
    setDebtForm({ name: "", principal: "", rate: "", emi: "" });
  };

  const removeDebt = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const addGroup = (e) => {
    e.preventDefault();
    const amount = Number(groupForm.amount);
    if (!groupForm.name || !amount) return;
    const members = groupForm.members
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    setGroups((prev) => [
      ...prev,
      { id: `${Date.now()}`, ...groupForm, amount, members },
    ]);
    setGroupForm({ name: "", amount: "", members: "" });
  };

  const removeGroup = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const settleAmount = (group) => {
    const count = Math.max(group.members.length, 1);
    return Math.round(group.amount / count);
  };

  const projectedPayoff = (debt) => {
    const months = Math.ceil(debt.principal / debt.emi);
    return months || 0;
  };

  const vaultMonthly = Math.round(
    (Number(vault.rulePercent || 0) / 100) * netIncome
  );

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold text-primary">Money Lab</h1>
        <p className="text-sm text-secondary mt-1">
          Debt, savings automation, merchant insights, and smart splits in one hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface surface-tint-2 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Debt Tracker</h2>
          <form onSubmit={addDebt} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Loan name"
              value={debtForm.name}
              onChange={(e) => setDebtForm({ ...debtForm, name: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              type="number"
              placeholder="Principal"
              value={debtForm.principal}
              onChange={(e) =>
                setDebtForm({ ...debtForm, principal: e.target.value })
              }
            />
            <input
              className="border px-3 py-2 rounded"
              type="number"
              placeholder="Interest %"
              value={debtForm.rate}
              onChange={(e) => setDebtForm({ ...debtForm, rate: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              type="number"
              placeholder="EMI"
              value={debtForm.emi}
              onChange={(e) => setDebtForm({ ...debtForm, emi: e.target.value })}
            />
            <button className="btn-primary btn-premium btn-luxe md:col-span-4">
              Add Debt
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {debts.length === 0 ? (
              <p className="text-sm text-secondary">No debts yet.</p>
            ) : (
              debts.map((d, i) => (
                <div key={d.id} className={`surface surface-tint-${(i % 6) + 1} p-3 rounded-xl flex items-center justify-between`}>
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-secondary">
                      <span data-amount>{formatCurrency(d.principal)}</span> • EMI <span data-amount>{formatCurrency(d.emi)}</span> • {d.rate || 0}% APR
                    </p>
                    <p className="text-xs text-secondary">
                      Payoff ~ {projectedPayoff(d)} months
                    </p>
                  </div>
                  <button className="btn-ghost px-2 py-1 text-xs" onClick={() => removeDebt(d.id)} type="button">
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface surface-tint-3 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Savings Vault</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Locked goal name"
              value={vault.lockedGoal}
              onChange={(e) => setVault({ ...vault, lockedGoal: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              type="number"
              placeholder="Target"
              value={vault.target}
              onChange={(e) => setVault({ ...vault, target: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              type="number"
              placeholder="Auto-save %"
              value={vault.rulePercent}
              onChange={(e) => setVault({ ...vault, rulePercent: e.target.value })}
            />
          </div>
          <div className="mt-4 surface surface-tint-4 p-4 rounded-xl">
            <p className="text-sm text-secondary">Projected monthly auto-save</p>
            <p className="text-2xl font-semibold text-primary mt-1">
              <span data-amount>{formatCurrency(vaultMonthly)}</span>
            </p>
            <p className="text-xs text-secondary mt-1">
              Based on net balance <span data-amount>{formatCurrency(netIncome)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface surface-tint-4 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Merchant Insights</h2>
          <div className="space-y-3 mb-4">
            {merchantInsights.top.length === 0 ? (
              <p className="text-sm text-secondary">No merchant data yet.</p>
            ) : (
              merchantInsights.top.map((m, i) => (
                <div key={m.merchant} className={`surface surface-tint-${(i % 6) + 1} p-3 rounded-xl flex items-center justify-between`}>
                  <span className="capitalize">{m.merchant}</span>
                  <span className="font-semibold"><span data-amount>{formatCurrency(m.total)}</span></span>
                </div>
              ))
            )}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={merchantInsights.months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="surface surface-tint-5 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Smart Split</h2>
          <form onSubmit={addGroup} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Group name"
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              type="number"
              placeholder="Amount"
              value={groupForm.amount}
              onChange={(e) => setGroupForm({ ...groupForm, amount: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              placeholder="Members (comma separated)"
              value={groupForm.members}
              onChange={(e) => setGroupForm({ ...groupForm, members: e.target.value })}
            />
            <button className="btn-primary btn-premium btn-luxe md:col-span-3">
              Add Split
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {groups.length === 0 ? (
              <p className="text-sm text-secondary">No split groups yet.</p>
            ) : (
              groups.map((g, i) => (
                <div key={g.id} className={`surface surface-tint-${(i % 6) + 1} p-3 rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{g.name}</p>
                    <button className="btn-ghost px-2 py-1 text-xs" onClick={() => removeGroup(g.id)} type="button">
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-secondary">
                    Members: {g.members.join(", ") || "—"}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    Each owes <span data-amount>{formatCurrency(settleAmount(g))}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
