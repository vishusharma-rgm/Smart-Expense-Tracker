import { saveAs } from "file-saver";
import { formatCurrency, formatDate } from "./formatters";

export function exportExpensesToCSV(expenses) {
  const headers = ["Title", "Amount", "Category", "Date"];

  const rows = expenses.map((exp) => [
    exp.title,
    formatCurrency(exp.amount),
    exp.category,
    formatDate(exp.date || exp.createdAt),
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "expenses.csv");
}
