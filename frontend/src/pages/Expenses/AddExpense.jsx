import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { detectCategory } from "../../utils/categoryRules";

export default function AddExpense({ headerAction = null }) {
  const { addExpense } = useExpenses();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
    date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      // Auto-detect category while typing
      const detected = detectCategory(value);

      setForm({
        ...form,
        title: value,
        category: detected
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
      category: detectCategory(form.title),
    };
    if (!payload.date) delete payload.date;
    addExpense(payload);

    setForm({
      title: "",
      amount: "",
      category: "Other",
      date: ""
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Add Expense
          </h2>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>

      <input
        name="title"
        placeholder="Title (e.g. Zomato, Uber, Rent)"
        value={form.title}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <p className="text-xs text-secondary">
        Smart category: <strong>{form.category}</strong>
      </p>

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Housing">Housing</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Add Expense
      </button>
    </form>
  );
}
