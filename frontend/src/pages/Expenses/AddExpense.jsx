import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { detectCategory } from "../../utils/categoryRules";

export default function AddExpense() {
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
      className="space-y-4 surface surface-tint-1 p-6 rounded-lg"
    >
      <h2 className="text-lg font-semibold mb-2">
        Add Expense
      </h2>

      <input
        name="title"
        placeholder="Title (e.g. Zomato, Uber, Rent)"
        value={form.title}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

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
