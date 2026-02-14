import { formatCurrency } from "../../utils/formatters";

export default function PieChart({ expenses }) {
  const categories = {};

  expenses.forEach((exp) => {
    categories[exp.category] =
      (categories[exp.category] || 0) + Number(exp.amount);
  });

  return (
    <div className="space-y-2">
      {Object.keys(categories).length === 0 ? (
        <p className="text-sm text-gray-400">
          No data available
        </p>
      ) : (
        Object.entries(categories).map(([cat, amount]) => (
          <div
            key={cat}
            className="flex justify-between text-sm border-b pb-1"
          >
            <span>{cat}</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        ))
      )}
    </div>
  );
}
