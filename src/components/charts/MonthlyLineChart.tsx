"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyData } from "@/types";

interface MonthlyLineChartProps {
  data: MonthlyData[];
}

export default function MonthlyLineChart({ data }: MonthlyLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted">
        No monthly data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-card-border)" />
        <XAxis dataKey="month" stroke="var(--color-muted)" fontSize={12} />
        <YAxis stroke="var(--color-muted)" fontSize={12} />
        <Tooltip
          formatter={(value) => `$${Number(value).toFixed(2)}`}
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)",
            borderRadius: "12px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: "#ef4444", r: 4 }}
          activeDot={{ r: 6 }}
          animationBegin={0}
          animationDuration={800}
          name="Expenses"
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", r: 4 }}
          activeDot={{ r: 6 }}
          animationBegin={200}
          animationDuration={800}
          name="Income"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
