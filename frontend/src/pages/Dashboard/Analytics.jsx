// import { useState, useMemo } from "react";
// import { useExpenses } from "../../context/ExpenseContext";
// import { useTheme } from "../../context/ThemeContext";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";
// import { exportExpensesToCSV } from "../../utils/exportCSV";

// export default function Analytics() {
//   const { expenses } = useExpenses();
//   const { dark } = useTheme();

//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("All");

//   const COLORS = dark
//     ? ["#38bdf8", "#22c55e", "#f59e0b", "#a78bfa", "#e2e8f0"]
//     : ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

//   /* ================= FILTER SYSTEM ================= */

//   const filteredExpenses = useMemo(() => {
//     return expenses.filter((exp) => {
//       const matchSearch = exp.title
//         .toLowerCase()
//         .includes(search.toLowerCase());

//       const matchCategory =
//         categoryFilter === "All" ||
//         exp.category === categoryFilter;

//       return matchSearch && matchCategory;
//     });
//   }, [expenses, search, categoryFilter]);

//   /* ================= CATEGORY BREAKDOWN ================= */

//   const categoryMap = {};
//   filteredExpenses.forEach((exp) => {
//     categoryMap[exp.category] =
//       (categoryMap[exp.category] || 0) + exp.amount;
//   });

//   const pieData = Object.keys(categoryMap).map((key) => ({
//     name: key,
//     value: categoryMap[key],
//   }));

//   /* ================= MONTHLY COMPARISON ================= */

//   const now = new Date();
//   const currentMonth = now.getMonth();
//   const currentYear = now.getFullYear();

//   let thisMonthTotal = 0;
//   let lastMonthTotal = 0;

//   filteredExpenses.forEach((exp) => {
//     const d = new Date(exp.date);

//     if (
//       d.getMonth() === currentMonth &&
//       d.getFullYear() === currentYear
//     ) {
//       thisMonthTotal += exp.amount;
//     }

//     if (
//       d.getMonth() === currentMonth - 1 &&
//       d.getFullYear() === currentYear
//     ) {
//       lastMonthTotal += exp.amount;
//     }
//   });

//   /* ================= TOP CATEGORY ================= */

//   const sortedCategories = [...pieData].sort(
//     (a, b) => b.value - a.value
//   );

//   const topCategory = sortedCategories[0];

//   /* ================= FORECAST ================= */

//   const averageMonthlySpend =
//     (thisMonthTotal + lastMonthTotal) / 2;

//   const forecastNextMonth = Math.round(
//     averageMonthlySpend || 0
//   );

//   return (
//     <div className="space-y-10">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-semibold tracking-tight">
//           Analytics
//         </h1>

//         <button
//           onClick={() =>
//             exportExpensesToCSV(filteredExpenses)
//           }
//           className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//         >
//           Export CSV
//         </button>
//       </div>

//       {/* SEARCH + FILTER */}
//       <div className="surface p-6 rounded-2xl flex gap-4">
//         <input
//           type="text"
//           placeholder="Search expense..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-full bg-transparent text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)]"
//         />

//         <select
//           value={categoryFilter}
//           onChange={(e) =>
//             setCategoryFilter(e.target.value)
//           }
//           className="border px-3 py-2 rounded bg-transparent text-[color:var(--text-primary)]"
//         >
//           <option value="All">All</option>
//           <option value="Food">Food</option>
//           <option value="Travel">Travel</option>
//           <option value="Housing">Housing</option>
//           <option value="Shopping">Shopping</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* PIE CHART */}
//       <div className="surface p-6 rounded-2xl">
//         <h2 className="text-lg font-semibold mb-4">
//           Category Breakdown
//         </h2>

//         <PieChart width={400} height={300}>
//           <Pie
//             data={pieData}
//             dataKey="value"
//             nameKey="name"
//             outerRadius={100}
//             label
//           >
//             {pieData.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={
//                   COLORS[index % COLORS.length]
//                 }
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </div>

//       {/* MONTHLY COMPARISON */}
//       <div className="surface p-6 rounded-2xl">
//         <h2 className="text-lg font-semibold mb-4">
//           Monthly Comparison
//         </h2>

//         <BarChart
//           width={500}
//           height={300}
//           data={[
//             {
//               name: "Last Month",
//               value: lastMonthTotal,
//             },
//             {
//               name: "This Month",
//               value: thisMonthTotal,
//             },
//           ]}
//         >
//           <CartesianGrid
//             stroke={dark ? "#1f2a3d" : "#e5e7eb"}
//             strokeDasharray="3 3"
//           />
//           <XAxis dataKey="name" stroke={dark ? "#93a4bf" : "#6b7280"} />
//           <YAxis stroke={dark ? "#93a4bf" : "#6b7280"} />
//           <Tooltip />
//           <Bar
//             dataKey="value"
//             fill={dark ? "#38bdf8" : "#111827"}
//           />
//         </BarChart>
//       </div>

//       {/* TOP CATEGORY */}
//       {topCategory && (
//         <div className="surface p-6 rounded-2xl">
//           <h2 className="text-lg font-semibold">
//             Top Spending Category
//           </h2>
//           <p className="mt-2 text-xl">
//             {topCategory.name} — ₹
//             {topCategory.value}
//           </p>
//         </div>
//       )}

//       {/* FORECAST */}
//       <div className="surface p-6 rounded-2xl">
//         <h2 className="text-lg font-semibold">
//           Forecast (Next Month Estimate)
//         </h2>
//         <p className="mt-2 text-xl">
//           ₹{forecastNextMonth}
//         </p>
//       </div>

//     </div>
//   );
// }
import { useState, useMemo } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { useTheme } from "../../context/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { exportExpensesToCSV } from "../../utils/exportCSV";
import { formatCurrency } from "../../utils/formatters";

export default function Analytics() {
  const { expenses } = useExpenses();
  const { dark } = useTheme();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  /* ================= COLORS ================= */

  const getValueColor = (value) => {
    const v = Number(value || 0);
    if (v >= 2000) return dark ? "#ef4444" : "#dc2626"; // 2000+
    if (v >= 1500) return dark ? "#f97316" : "#ea580c"; // 1500-1999
    if (v >= 1000) return dark ? "#f59e0b" : "#d97706"; // 1000-1499
    if (v >= 500) return dark ? "#38bdf8" : "#0ea5e9"; // 500-999
    return dark ? "#22c55e" : "#16a34a"; // < 500
  };

  /* ================= FILTER SYSTEM ================= */

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchSearch = exp.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "All" ||
        exp.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [expenses, search, categoryFilter]);

  /* ================= CATEGORY BREAKDOWN ================= */

  const pieData = filteredExpenses.map((exp, index) => ({
    name: exp.title || exp.category || `Item ${index + 1}`,
    value: Number(exp.amount || 0),
  }));
  const hasPieData = pieData.length > 0;
  const pieDisplayData = hasPieData
    ? pieData
    : [{ name: "No Data", value: 1 }];

  /* ================= MONTHLY COMPARISON ================= */

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  filteredExpenses.forEach((exp) => {
    const rawDate = exp.date || exp.createdAt || Date.now();
    let d = new Date(rawDate);
    const year = d.getFullYear();
    if (Number.isNaN(d.getTime()) || year < 2000 || year > 2100) {
      d = new Date(exp.createdAt || Date.now());
    }

    if (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    ) {
      thisMonthTotal += Number(exp.amount || 0);
    }

    if (
      d.getMonth() === currentMonth - 1 &&
      d.getFullYear() === currentYear
    ) {
      lastMonthTotal += Number(exp.amount || 0);
    }
  });

  /* ================= TOP CATEGORY ================= */

  const sortedCategories = [...pieData].sort(
    (a, b) => b.value - a.value
  );

  const topCategory = sortedCategories[0];

  /* ================= FORECAST ================= */

  const averageMonthlySpend =
    (thisMonthTotal + lastMonthTotal) / 2;

  const forecastNextMonth = Math.round(
    averageMonthlySpend || 0
  );

  /* ================= UI ================= */
  const totalSpend = pieData.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );


  const chartTooltip = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    borderRadius: "12px",
    boxShadow: "0 10px 24px var(--shadow-color)",
  };

  const chartCardStyle = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))",
  };

  return (
    <div className="space-y-8 p-6">

      {/* HEADER */}
      <div className="surface surface-tint-1 p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">
              Insights
            </p>
            <h1 className="text-3xl font-semibold text-primary">
              Analytics
            </h1>
            <p className="text-sm text-secondary mt-1">
              Monthly spend trends and category distribution.
            </p>
          </div>

          <button
            onClick={() => exportExpensesToCSV(filteredExpenses)}
            className="btn-primary btn-premium btn-luxe transition"
          >
            Export CSV
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-muted surface-tint-2 p-4 rounded-2xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              This Month
            </p>
            <p className="text-2xl font-semibold text-primary mt-2">
              <span data-amount>{formatCurrency(thisMonthTotal)}</span>
            </p>
          </div>
          <div className="surface-muted surface-tint-3 p-4 rounded-2xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Last Month
            </p>
            <p className="text-2xl font-semibold text-primary mt-2">
              <span data-amount>{formatCurrency(lastMonthTotal)}</span>
            </p>
          </div>
          <div className="surface-muted surface-tint-4 p-4 rounded-2xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Forecast
            </p>
            <p className="text-2xl font-semibold text-primary mt-2">
              <span data-amount>{formatCurrency(forecastNextMonth)}</span>
            </p>
          </div>
          <div className="surface-muted surface-tint-5 p-4 rounded-2xl">
            <p className="text-xs text-secondary uppercase tracking-[0.2em]">
              Top Category
            </p>
            <p className="text-xl font-semibold text-primary mt-2">
              {topCategory?.name || "—"}
            </p>
            <p className="text-sm text-secondary">
              {topCategory ? (
                <span data-amount>{formatCurrency(topCategory.value)}</span>
              ) : (
                "No data yet"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="surface surface-tint-6 p-6 rounded-2xl flex flex-col gap-4 lg:flex-row">

        <input
          type="text"
          placeholder="Search expense..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full bg-transparent text-primary placeholder:text-secondary"
        />

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
          className="border px-3 py-2 rounded bg-transparent text-primary"
        >
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Housing">Housing</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* PIE CHART */}
      <div className="surface surface-tint-2 p-6 rounded-2xl" style={chartCardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">
            Category Breakdown
          </h2>
          <span className="text-xs text-secondary uppercase tracking-[0.2em]">
            Share
          </span>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={pieDisplayData}
              dataKey="value"
              nameKey="name"
              innerRadius={0}
              outerRadius={120}
              paddingAngle={2}
              stroke="var(--bg-card)"
              strokeWidth={2}
              cornerRadius={6}
              animationDuration={900}
              label={({ name, value }) =>
                hasPieData ? `${name} — ${formatCurrency(value)}` : ""
              }
            >
              {!hasPieData && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: "var(--text-secondary)", fontSize: 12 }}
                >
                  No Data
                </text>
              )}
              {pieDisplayData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    hasPieData
                      ? getValueColor(entry.value)
                      : dark
                        ? "#1f2937"
                        : "#e5e7eb"
                  }
                />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltip} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "var(--text-secondary)" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* MONTHLY COMPARISON */}
      <div className="surface surface-tint-3 p-6 rounded-2xl" style={chartCardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">
            Monthly Comparison
          </h2>
          <span className="text-xs text-secondary uppercase tracking-[0.2em]">
            Trend
          </span>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={[
              { name: "Last Month", value: lastMonthTotal },
              { name: "This Month", value: thisMonthTotal },
            ]}
          >
            <defs>
              <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={dark ? "#a78bfa" : "#8b5cf6"} stopOpacity={0.9} />
                <stop offset="100%" stopColor={dark ? "#22d3ee" : "#0ea5e9"} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={dark ? "#c4b5fd" : "#8b5cf6"} stopOpacity={0.6} />
                <stop offset="100%" stopColor={dark ? "#67e8f9" : "#0ea5e9"} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={dark ? "#1f2a3d" : "#e5e7eb"}
              strokeDasharray="4 6"
              vertical={false}
            />
            <XAxis dataKey="name" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip contentStyle={chartTooltip} />
            <Bar
              dataKey="value"
              fill="url(#barFill)"
              stroke="url(#barStroke)"
              strokeWidth={1}
              radius={[14, 14, 10, 10]}
              barSize={54}
              animationDuration={900}
            >
              {[
                { name: "Last Month", value: lastMonthTotal },
                { name: "This Month", value: thisMonthTotal },
              ].map((entry, index) => (
                <Cell key={index} fill={getValueColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TOP CATEGORY */}
    </div>
  );
}
