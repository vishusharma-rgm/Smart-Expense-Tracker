import { useIncome } from "../../context/IncomeContext";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function IncomeList() {
  const { incomes } = useIncome();

  if (!incomes.length) {
    return (
      <div className="surface surface-tint-3 p-6 rounded-xl">
        <p className="text-sm text-secondary">No income entries yet.</p>
      </div>
    );
  }

  return (
    <div className="surface surface-tint-3 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Recent Income</h3>
      <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
        {incomes.slice(0, 5).map((income) => (
          <div
            key={income._id}
            className="flex items-center justify-between border-b border-[color:var(--border-color)] pb-2 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-primary">
                {income.source}
              </p>
              <p className="text-xs text-secondary">
                {formatDate(income.date || income.createdAt)}
              </p>
            </div>
            <p className="text-sm font-semibold text-primary">
              <span data-amount>{formatCurrency(Number(income.amount || 0))}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
