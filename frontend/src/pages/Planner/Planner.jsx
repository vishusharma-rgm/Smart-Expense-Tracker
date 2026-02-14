import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import GlassyCalendarIcon from "../../components/ui/GlassyCalendarIcon";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const BILLS_KEY = "bill_calendar_items";
const RECEIPTS_KEY = "receipt_vault_items";
const TAX_KEY = "tax_prep_categories";

const deductibleDefaults = ["Housing", "Travel", "Shopping", "Other"];

export default function Planner() {
  const { expenses } = useExpenses();
  const { incomes } = useIncome();

  const [bills, setBills] = useState([]);
  const [billForm, setBillForm] = useState({
    name: "",
    amount: "",
    dueDate: "",
    reminder: "3"
  });

  const [receipts, setReceipts] = useState([]);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptExpenseId, setReceiptExpenseId] = useState("");

  const [deductibleCats, setDeductibleCats] = useState(deductibleDefaults);

  useEffect(() => {
    setBills(JSON.parse(localStorage.getItem(BILLS_KEY) || "[]"));
    setReceipts(JSON.parse(localStorage.getItem(RECEIPTS_KEY) || "[]"));
    setDeductibleCats(
      JSON.parse(localStorage.getItem(TAX_KEY) || "null") ||
        deductibleDefaults
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem(TAX_KEY, JSON.stringify(deductibleCats));
  }, [deductibleCats]);

  const cashflow = useMemo(() => {
    const now = new Date();
    const days = [];
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push({
        date: d.toISOString().slice(0, 10),
        income: 0,
        expense: 0
      });
    }

    const bucket = (d) => d.toISOString().slice(0, 10);
    incomes.forEach((inc) => {
      const d = new Date(inc.date || inc.createdAt || Date.now());
      const key = bucket(d);
      const item = days.find((x) => x.date === key);
      if (item) item.income += Number(inc.amount || 0);
    });
    expenses.forEach((exp) => {
      const d = new Date(exp.date || exp.createdAt || Date.now());
      const key = bucket(d);
      const item = days.find((x) => x.date === key);
      if (item) item.expense += Number(exp.amount || 0);
    });
    return days.map((d) => ({
      ...d,
      net: d.income - d.expense
    }));
  }, [expenses, incomes]);

  const upcomingBills = useMemo(() => {
    const now = new Date();
    return bills
      .map((b) => ({
        ...b,
        due: new Date(b.dueDate)
      }))
      .filter((b) => b.due >= now)
      .sort((a, b) => a.due - b.due)
      .slice(0, 6);
  }, [bills]);

  const taxSummary = useMemo(() => {
    const totals = {};
    deductibleCats.forEach((c) => (totals[c] = 0));
    expenses.forEach((exp) => {
      const cat = exp.category || "Other";
      if (deductibleCats.includes(cat)) {
        totals[cat] += Number(exp.amount || 0);
      }
    });
    return totals;
  }, [expenses, deductibleCats]);

  const addBill = (e) => {
    e.preventDefault();
    if (!billForm.name || !billForm.dueDate) return;
    setBills((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: billForm.name,
        amount: Number(billForm.amount || 0),
        dueDate: billForm.dueDate,
        reminder: Number(billForm.reminder || 3)
      }
    ]);
    setBillForm({ name: "", amount: "", dueDate: "", reminder: "3" });
  };

  const removeBill = (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  const addReceipt = () => {
    if (!receiptFile) return;
    setReceipts((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: receiptFile.name,
        size: receiptFile.size,
        type: receiptFile.type,
        expenseId: receiptExpenseId || null,
        createdAt: new Date().toISOString()
      }
    ]);
    setReceiptFile(null);
    setReceiptExpenseId("");
  };

  const removeReceipt = (id) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleCategory = (cat) => {
    setDeductibleCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const exportTaxCSV = () => {
    const rows = [
      ["Category", "Amount"],
      ...Object.entries(taxSummary).map(([k, v]) => [k, v])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tax-prep.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <GlassyCalendarIcon size={34} />
          <h1 className="text-2xl font-semibold text-primary">
            Planner & Compliance
          </h1>
        </div>
        <p className="text-sm text-secondary mt-1">
          Bills, cashflow, receipts, and tax-ready summaries in one place.
        </p>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl fade-rise">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Cashflow Timeline</h2>
          <span className="text-xs text-secondary uppercase tracking-[0.2em]">
            Last 30 Days
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={cashflow}>
            <defs>
              <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="net" stroke="#16a34a" fill="url(#netFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface surface-tint-3 p-6 rounded-2xl fade-rise">
          <h2 className="text-lg font-semibold mb-4">Bill Calendar</h2>
          <form onSubmit={addBill} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Bill name"
              value={billForm.name}
              onChange={(e) => setBillForm({ ...billForm, name: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              placeholder="Amount"
              type="number"
              value={billForm.amount}
              onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded"
              type="date"
              value={billForm.dueDate}
              onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
            />
            <select
              className="border px-3 py-2 rounded"
              value={billForm.reminder}
              onChange={(e) => setBillForm({ ...billForm, reminder: e.target.value })}
            >
              <option value="1">Remind 1 day</option>
              <option value="3">Remind 3 days</option>
              <option value="7">Remind 7 days</option>
            </select>
            <button className="btn-primary btn-premium btn-luxe md:col-span-4">
              Add Bill
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {upcomingBills.length === 0 ? (
              <p className="text-sm text-secondary">No upcoming bills.</p>
            ) : (
              upcomingBills.map((b) => (
                <div key={b.id} className="surface surface-tint-4 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-secondary">
                      Due {formatDate(b.dueDate)} • Remind {b.reminder}d
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold"><span data-amount>{formatCurrency(b.amount)}</span></p>
                    <button
                      className="btn-ghost px-2 py-1 text-xs"
                      onClick={() => removeBill(b.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface surface-tint-5 p-6 rounded-2xl fade-rise">
          <h2 className="text-lg font-semibold mb-4">Receipts Vault</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="file"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              className="border px-3 py-2 rounded"
            />
            <select
              className="border px-3 py-2 rounded"
              value={receiptExpenseId}
              onChange={(e) => setReceiptExpenseId(e.target.value)}
            >
              <option value="">Attach to expense (optional)</option>
              {expenses.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.title} — {formatCurrency(e.amount)}
                </option>
              ))}
            </select>
            <button className="btn-primary btn-premium btn-luxe" onClick={addReceipt} type="button">
              Upload
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {receipts.length === 0 ? (
              <p className="text-sm text-secondary">No receipts uploaded.</p>
            ) : (
              receipts.map((r, index) => (
                <div key={r.id} className={`surface surface-tint-${(index % 6) + 1} p-3 rounded-xl flex items-center justify-between`}>
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-secondary">
                      {r.type} • {(r.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    className="btn-ghost px-2 py-1 text-xs"
                    onClick={() => removeReceipt(r.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="surface surface-tint-6 p-6 rounded-2xl fade-rise">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tax Prep</h2>
          <button className="btn-ghost px-3 py-2 text-sm" onClick={exportTaxCSV} type="button">
            Export CSV
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Food", "Travel", "Housing", "Shopping", "Other"].map((cat) => (
            <button
              key={cat}
              className={`btn-ghost px-3 py-2 text-sm ${deductibleCats.includes(cat) ? "accent-ring" : ""}`}
              onClick={() => toggleCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(taxSummary).map(([cat, amount], index) => (
            <div key={cat} className={`surface surface-tint-${(index % 6) + 1} p-4 rounded-xl`}>
              <p className="text-sm text-secondary">{cat}</p>
              <p className="text-xl font-semibold text-primary mt-2"><span data-amount>{formatCurrency(amount)}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
