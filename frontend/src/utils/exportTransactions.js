import { formatCurrency, formatDate } from "./formatters";

export function exportTransactionsToCSV(transactions) {
  const headers = ["Type", "Title", "Category", "Amount", "Date"];

  const rows = transactions.map((tx) => [
    tx.type,
    tx.title,
    tx.category || "",
    formatCurrency(tx.amount),
    formatDate(tx.date)
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTransactionsToPDF(transactions) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rows = transactions
    .map(
      (tx) => `
        <tr>
          <td>${tx.type}</td>
          <td>${tx.title}</td>
          <td>${tx.category || ""}</td>
          <td>${formatCurrency(tx.amount)}</td>
          <td>${formatDate(tx.date)}</td>
        </tr>
      `
    )
    .join("");

  win.document.write(`
    <html>
      <head>
        <title>Transactions Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { font-size: 20px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #f5f5f5; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Transactions Report</h1>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  win.document.close();
}
