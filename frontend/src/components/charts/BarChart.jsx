import { formatCurrency } from "../../utils/formatters";

export default function BarChart({ expenses }) {
  const monthly = {};

  expenses.forEach((exp) => {
    const month = new Date(exp.date || exp.createdAt || Date.now()).toLocaleString("default", {
      month: "short",
    });

    monthly[month] =
      (monthly[month] || 0) + Number(exp.amount);
  });

  return (
    <div className="space-y-2">
      {Object.keys(monthly).length === 0 ? (
        <p className="text-sm text-gray-400">
          No data available
        </p>
      ) : (
        Object.entries(monthly).map(([month, amount]) => (
          <div key={month}>
            <div className="flex justify-between text-sm mb-1">
              <span>{month}</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-black rounded"
                style={{ width: `${Math.min(amount / 10, 100)}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
