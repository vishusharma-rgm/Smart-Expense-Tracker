import { useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { formatCurrency, formatDate } from "../../utils/formatters";

const tips = [
  "Try the 24‑hour rule before non‑essential purchases.",
  "Set a weekly cap for eating out and track it.",
  "Round‑up savings: save the spare change of each expense.",
  "Batch your shopping trips to cut impulse buys.",
];

export default function Leaderboard() {
  const { expenses } = useExpenses();
  const { incomes } = useIncome();
  const [weeklyGoal, setWeeklyGoal] = useState(3000);

  const now = new Date();

  const totals = useMemo(() => {
    const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  }, [incomes, expenses]);

  const last30 = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const daySpend = expenses
        .filter((e) => {
          const ed = new Date(e.date || e.createdAt || Date.now());
          return ed.toISOString().slice(0, 10) === key;
        })
        .reduce((s, e) => s + Number(e.amount || 0), 0);
      days.push({ key, date: d, spend: daySpend });
    }
    return days;
  }, [expenses]);

  const noSpendDays = last30.filter((d) => d.spend === 0).length;
  const streak = useMemo(() => {
    let count = 0;
    for (let i = last30.length - 1; i >= 0; i -= 1) {
      if (last30[i].spend === 0) count += 1;
      else break;
    }
    return count;
  }, [last30]);

  const weeklySpend = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);
    return expenses
      .filter((e) => {
        const d = new Date(e.date || e.createdAt || Date.now());
        return d >= weekAgo;
      })
      .reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [expenses]);

  const challengeProgress = useMemo(() => {
    const junk = expenses.filter((e) => (e.category || "Other") === "Shopping");
    const last30Junk = junk.filter((e) => {
      const d = new Date(e.date || e.createdAt || Date.now());
      const daysAgo = (now - d) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30;
    }).length;
    return Math.max(30 - last30Junk, 0);
  }, [expenses]);

  const milestones = useMemo(() => {
    const txCount = expenses.length + incomes.length;
    const saved = Math.max(totals.net, 0);
    return [
      { label: "Transactions", value: txCount, goal: 100 },
      { label: "Saved", value: saved, goal: 10000 },
      { label: "No‑Spend Days", value: noSpendDays, goal: 10 },
    ];
  }, [expenses, incomes, totals.net, noSpendDays]);

  const points = useMemo(() => {
    const txCount = expenses.length + incomes.length;
    const saved = Math.max(totals.net, 0);
    const savePoints = Math.min(Math.floor(saved / 1000) * 50, 2000);
    const streakPoints = Math.min(streak * 20, 600);
    const noSpendPoints = Math.min(noSpendDays * 15, 450);
    const txPoints = Math.min(txCount * 5, 500);
    return savePoints + streakPoints + noSpendPoints + txPoints;
  }, [expenses, incomes, totals.net, streak, noSpendDays]);

  const level = useMemo(() => {
    if (points >= 3000) return "Diamond";
    if (points >= 2000) return "Platinum";
    if (points >= 1200) return "Gold";
    if (points >= 600) return "Silver";
    return "Bronze";
  }, [points]);

  const badges = useMemo(() => {
    const list = [];
    if (streak >= 7) list.push("7‑Day Streak");
    if (noSpendDays >= 10) list.push("No‑Spend Master");
    if (totals.net >= 10000) list.push("Saved ₹10K");
    if (expenses.length + incomes.length >= 100) list.push("100 Transactions");
    if (challengeProgress >= 20) list.push("Challenge Hero");
    return list.length ? list : ["First Steps"];
  }, [streak, noSpendDays, totals.net, expenses.length, incomes.length, challengeProgress]);

  const digest = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);
    const weekExpense = expenses
      .filter((e) => new Date(e.date || e.createdAt || Date.now()) >= weekAgo)
      .reduce((s, e) => s + Number(e.amount || 0), 0);
    const weekIncome = incomes
      .filter((i) => new Date(i.date || i.createdAt || Date.now()) >= weekAgo)
      .reduce((s, i) => s + Number(i.amount || 0), 0);
    return { weekExpense, weekIncome };
  }, [expenses, incomes]);

  const shareInsight = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f7f3ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.font = "48px serif";
    ctx.fillText("My Money Snapshot", 80, 140);
    ctx.font = "36px serif";
    ctx.fillText(`Net: ${formatCurrency(totals.net)}`, 80, 260);
    ctx.fillText(`No‑Spend Days: ${noSpendDays}`, 80, 340);
    ctx.fillText(`Streak: ${streak} days`, 80, 420);
    const link = document.createElement("a");
    link.download = "insight-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold text-primary">Leaderboard</h1>
        <p className="text-sm text-secondary mt-1">
          Streaks, challenges, and milestones to keep you on track.
        </p>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Points</p>
            <p className="text-2xl font-semibold text-primary mt-1">{points}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Level</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="level-medal" aria-hidden="true">🏅</span>
              <p className="text-2xl font-semibold text-primary">{level}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Badges</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {badges.map((b) => (
                <span key={b} className="surface surface-tint-4 px-3 py-1 rounded-full text-xs">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Savings Streak Calendar</h3>
        <div className="grid grid-cols-10 gap-2">
          {last30.map((d) => (
            <div
              key={d.key}
              className={`h-6 rounded ${d.spend === 0 ? "bg-green-500/70" : "bg-red-400/60"}`}
              title={`${formatDate(d.date)} • ${formatCurrency(d.spend)}`}
            />
          ))}
        </div>
        <div className="mt-3 text-sm text-secondary">
          Current streak: <span className="text-primary font-semibold">{streak} days</span> •
          No‑spend days (30d): <span className="text-primary font-semibold">{noSpendDays}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface surface-tint-3 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-3">Challenges</h3>
          <div className="surface surface-tint-4 p-4 rounded-xl">
            <p className="text-sm text-secondary">30‑day no‑junk‑spend</p>
            <p className="text-xl font-semibold mt-2">
              {challengeProgress}/30 days clean
            </p>
            <div className="h-2 rounded-full bg-[color:var(--border-color)] mt-3">
              <div
                className="h-2 bg-amber-500 rounded-full"
                style={{ width: `${(challengeProgress / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="surface surface-tint-5 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-3">Weekly Goals</h3>
          <div className="surface surface-tint-6 p-4 rounded-xl">
            <p className="text-sm text-secondary">Weekly spend cap</p>
            <input
              type="number"
              className="border px-3 py-2 rounded w-full mt-2"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Number(e.target.value || 0))}
            />
            <p className="text-sm text-secondary mt-3">
              This week: <span data-amount>{formatCurrency(weeklySpend)}</span>
            </p>
            <div className="h-2 rounded-full bg-[color:var(--border-color)] mt-2">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${Math.min((weeklySpend / weeklyGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="surface surface-tint-4 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((m, i) => (
            <div key={m.label} className={`surface surface-tint-${(i % 6) + 1} p-4 rounded-xl`}>
              <p className="text-xs text-secondary uppercase tracking-[0.2em]">{m.label}</p>
              <p className="text-xl font-semibold mt-2">
                <span data-amount>{formatCurrency(m.value)}</span> / {formatCurrency(m.goal)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface surface-tint-5 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">Weekly Digest</h3>
        <p className="text-sm text-secondary">
          Income: <span data-amount>{formatCurrency(digest.weekIncome)}</span> •
          Expense: <span data-amount>{formatCurrency(digest.weekExpense)}</span>
        </p>
      </div>

      <div className="surface surface-tint-6 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Personalized Tips</h3>
          <span className="text-xs text-secondary uppercase tracking-[0.2em]">Daily</span>
        </div>
        <div className="grid gap-3">
          {tips.map((t, i) => (
            <div key={i} className="surface surface-tint-2 p-3 rounded-xl">
              <p className="text-sm text-secondary">{t}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface surface-tint-1 p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shareable Insight Card</h3>
          <button className="btn-primary btn-premium btn-luxe" onClick={shareInsight}>
            Export Image
          </button>
        </div>
      </div>
    </div>
  );
}
