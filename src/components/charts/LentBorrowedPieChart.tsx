"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface LentBorrowedPieChartProps {
  lent: number;
  borrowed: number;
}

export default function LentBorrowedPieChart({ lent, borrowed }: LentBorrowedPieChartProps) {
  if (lent === 0 && borrowed === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted">
        No lent/borrowed data to display
      </div>
    );
  }

  const data = [
    { name: "Lent", value: lent },
    { name: "Borrowed", value: borrowed },
  ].filter((d) => d.value > 0);

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          animationBegin={0}
          animationDuration={800}
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[_entry.name === "Lent" ? 0 : 1]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)",
            borderRadius: "12px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
