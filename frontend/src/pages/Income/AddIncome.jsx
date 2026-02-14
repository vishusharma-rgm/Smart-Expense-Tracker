import { useState } from "react";
import { useIncome } from "../../context/IncomeContext";
import { formatCurrency } from "../../utils/formatters";

export default function AddIncome() {
  const { addIncome } = useIncome();

  const [form, setForm] = useState({
    title: "",
    amount: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountValue = Number(form.amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    await addIncome({
      source: form.title,
      amount: amountValue,
    });

    setMessage(`Income added: ${formatCurrency(amountValue)}`);
    setForm({ title: "", amount: "" });
  };

  return (
    <div className="surface surface-tint-2 p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-4">
        Add Income
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          placeholder="Income source"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="border px-3 py-2 rounded w-full"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          className="border px-3 py-2 rounded w-40"
          min="1"
          required
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-secondary">{message}</p>
      )}
    </div>
  );
}
