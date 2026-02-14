import { useMemo, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useIncome } from "../../context/IncomeContext";
import { exportTransactionsToCSV, exportTransactionsToPDF } from "../../utils/exportTransactions";
import { formatCurrency, formatDate } from "../../utils/formatters";

const categories = ["All", "Food", "Travel", "Housing", "Shopping", "Other", "Income"];

const normalizeDate = (value, fallback) => {
  const d = new Date(value || fallback || Date.now());
  const year = d.getFullYear();
  if (Number.isNaN(d.getTime()) || year < 2000 || year > 2100) {
    return new Date(fallback || Date.now());
  }
  return d;
};

export default function Transactions() {
  const { expenses, updateExpense, deleteExpense } = useExpenses();
  const { incomes, updateIncome, deleteIncome } = useIncome();

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const transactions = useMemo(() => {
    const expenseTx = expenses.map((e) => {
      const d = normalizeDate(e.date, e.createdAt);
      return {
        id: `expense-${e._id}`,
        rawId: e._id,
        type: "expense",
        title: e.title,
        category: e.category || "Other",
        amount: Number(e.amount || 0),
        date: d,
      };
    });

    const incomeTx = incomes.map((i) => {
      const d = normalizeDate(i.date, i.createdAt);
      return {
        id: `income-${i._id}`,
        rawId: i._id,
        type: "income",
        title: i.source,
        category: "Income",
        amount: Number(i.amount || 0),
        date: d,
      };
    });

    return [...expenseTx, ...incomeTx];
  }, [expenses, incomes]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchTab =
        tab === "All" ? true : tab.toLowerCase() === tx.type;
      const matchSearch = tx.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "All" || tx.category === categoryFilter;
      const matchType =
        typeFilter === "All" || tx.type === typeFilter.toLowerCase();

      const d = tx.date;
      const fromOk = dateFrom ? d >= new Date(dateFrom) : true;
      const toOk = dateTo ? d <= new Date(dateTo) : true;

      const minOk =
        minAmount === "" ? true : tx.amount >= Number(minAmount);
      const maxOk =
        maxAmount === "" ? true : tx.amount <= Number(maxAmount);

      return (
        matchTab &&
        matchSearch &&
        matchCategory &&
        matchType &&
        fromOk &&
        toOk &&
        minOk &&
        maxOk
      );
    });
  }, [
    transactions,
    tab,
    search,
    categoryFilter,
    typeFilter,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
  ]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let comp = 0;
      if (sortKey === "amount") comp = a.amount - b.amount;
      if (sortKey === "category") comp = a.category.localeCompare(b.category);
      if (sortKey === "type") comp = a.type.localeCompare(b.type);
      if (sortKey === "date") comp = a.date - b.date;
      return sortDir === "asc" ? comp : -comp;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(Math.ceil(sorted.length / pageSize), 1);
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const activeFilters = useMemo(() => {
    const chips = [];
    if (search) chips.push({ key: "search", label: `Search: ${search}` });
    if (categoryFilter !== "All")
      chips.push({ key: "category", label: `Category: ${categoryFilter}` });
    if (typeFilter !== "All")
      chips.push({ key: "type", label: `Type: ${typeFilter}` });
    if (dateFrom) chips.push({ key: "from", label: `From: ${dateFrom}` });
    if (dateTo) chips.push({ key: "to", label: `To: ${dateTo}` });
    if (minAmount) chips.push({ key: "min", label: `Min ${formatCurrency(minAmount)}` });
    if (maxAmount) chips.push({ key: "max", label: `Max ${formatCurrency(maxAmount)}` });
    return chips;
  }, [search, categoryFilter, typeFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const toggleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(paged.map((t) => t.id)));
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (tx) => {
    setEditingId(tx.id);
    setEditData({
      title: tx.title,
      amount: tx.amount,
      category: tx.category,
      date: tx.date.toISOString().slice(0, 10),
      type: tx.type
    });
  };

  const saveEdit = async (tx) => {
    if (tx.type === "expense") {
      await updateExpense(tx.rawId, {
        title: editData.title,
        amount: Number(editData.amount),
        category: editData.category,
        date: editData.date,
      });
    } else {
      await updateIncome(tx.rawId, {
        source: editData.title,
        amount: Number(editData.amount),
        date: editData.date,
      });
    }
    setEditingId(null);
  };

  const removeTx = async (tx) => {
    if (tx.type === "expense") await deleteExpense(tx.rawId);
    else await deleteIncome(tx.rawId);
  };

  const bulkDelete = async () => {
    const items = sorted.filter((tx) => selected.has(tx.id));
    for (const tx of items) {
      // eslint-disable-next-line no-await-in-loop
      await removeTx(tx);
    }
    setSelected(new Set());
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setTypeFilter("All");
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
    setSortKey("date");
    setSortDir("desc");
    setPage(1);
  };

  const removeFilterChip = (key) => {
    if (key === "search") setSearch("");
    if (key === "category") setCategoryFilter("All");
    if (key === "type") setTypeFilter("All");
    if (key === "from") setDateFrom("");
    if (key === "to") setDateTo("");
    if (key === "min") setMinAmount("");
    if (key === "max") setMaxAmount("");
  };

  return (
    <div className="space-y-6">
      <div className="surface surface-tint-1 p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">
              Transactions
            </p>
            <h1 className="text-2xl font-semibold text-primary">
              All Activity
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-ghost px-3 py-2 text-sm"
              onClick={() => exportTransactionsToCSV(sorted)}
              type="button"
            >
              Export CSV
            </button>
            <button
              className="btn-ghost px-3 py-2 text-sm"
              onClick={() => exportTransactionsToPDF(sorted)}
              type="button"
            >
              Export PDF
            </button>
            <button
              className="btn-primary btn-premium btn-luxe"
              onClick={bulkDelete}
              disabled={selected.size === 0}
              type="button"
            >
              Delete Selected
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Expenses", "Income"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`btn-ghost px-3 py-2 text-sm ${tab === t ? "accent-ring" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="surface surface-tint-2 p-6 rounded-2xl grid grid-cols-1 lg:grid-cols-6 gap-4">
        <input
          type="text"
          placeholder="Search title/source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded lg:col-span-2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All</option>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder={`Min ${formatCurrency(0).replace(/0/g, "")}`.trim() || "Min"}
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder={`Max ${formatCurrency(0).replace(/0/g, "")}`.trim() || "Max"}
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
          <option value="type">Type</option>
        </select>
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button
          className="btn-ghost px-3 py-2 text-sm"
          onClick={resetFilters}
          type="button"
        >
          Reset Filters
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="surface surface-tint-3 p-4 rounded-2xl flex flex-wrap gap-2">
          {activeFilters.map((chip) => (
            <button
              key={chip.key}
              className="btn-ghost px-3 py-1 text-xs"
              onClick={() => removeFilterChip(chip.key)}
              type="button"
            >
              {chip.label} ✕
            </button>
          ))}
        </div>
      )}

      <div className="surface surface-tint-3 p-6 rounded-2xl fade-rise">
        {sorted.length === 0 ? (
          <p className="text-secondary">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-[40px_120px_1fr_120px_90px_110px_140px] gap-3 text-xs text-secondary uppercase tracking-wider">
              <div>
                <input
                  type="checkbox"
                  checked={selected.size === paged.length}
                  onChange={toggleSelectAll}
                />
              </div>
              <div>Date</div>
              <div>Title</div>
              <div>Category</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Actions</div>
            </div>
            {paged.map((tx, index) => {
              const tintClass = `surface-tint-${(index % 6) + 1}`;
              return (
                <div
                  key={tx.id}
                  className={`surface ${tintClass} p-3 rounded-xl grid grid-cols-[40px_120px_1fr_120px_90px_110px_140px] gap-3 items-center`}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={selected.has(tx.id)}
                      onChange={() => toggleSelect(tx.id)}
                    />
                  </div>
                  <div>{formatDate(tx.date)}</div>
                  <div>
                    {editingId === tx.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editData.title || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                      />
                    ) : (
                      tx.title
                    )}
                  </div>
                  <div>
                    {editingId === tx.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editData.category || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            category: e.target.value
                          })
                        }
                        disabled={tx.type === "income"}
                      />
                    ) : (
                      tx.category
                    )}
                  </div>
                  <div>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/10">
                      {tx.type}
                    </span>
                  </div>
                  <div>
                    {editingId === tx.id ? (
                      <input
                        className="border px-2 py-1 rounded w-24"
                        type="number"
                        value={editData.amount || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            amount: e.target.value
                          })
                        }
                      />
                    ) : (
                      <span data-amount>{formatCurrency(tx.amount)}</span>
                    )}
                  </div>
                  <div className="space-x-2">
                    {editingId === tx.id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => saveEdit(tx)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-ghost px-2 py-1"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                          onClick={() => startEdit(tx)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => removeTx(tx)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-2 text-sm">
              <span className="text-secondary">
                Page {page} of {totalPages}
              </span>
              <div className="space-x-2">
                <button
                  className="btn-ghost px-3 py-1 text-sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <button
                  className="btn-ghost px-3 py-1 text-sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
