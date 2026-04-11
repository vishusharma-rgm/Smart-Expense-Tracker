import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/formatters";

export default function ExpenseList() {
  const { expenses, deleteExpense, updateExpense } = useExpenses();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const tints = [
    "surface-tint-1",
    "surface-tint-2",
    "surface-tint-3",
    "surface-tint-4",
    "surface-tint-5",
    "surface-tint-6"
  ];

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditData(expense);
  };

  const handleUpdate = () => {
    updateExpense(editingId, editData);
    setEditingId(null);
  };

  return (
    <div className="mt-6 space-y-4">
      {expenses.map((exp, index) => (
        <div
          key={exp._id}
          className={`surface ${tints[index % tints.length]} expense-list__item p-4 rounded flex justify-between items-center gap-4`}
        >
          {editingId === exp._id ? (
            <>
              <input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="border px-2 py-1"
              />
              <input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
                className="border px-2 py-1"
              />
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="font-semibold text-primary">{exp.title}</p>
                <p className="text-sm text-secondary">
                  {exp.category} • <span data-amount>{formatCurrency(exp.amount)}</span>
                </p>
              </div>

              <div className="expense-list__actions space-x-2">
                <button
                  onClick={() => startEdit(exp)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
