"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyData } from "@/types";

interface IncomeExpenseBarChartProps {
  data: MonthlyData[];
}

export default function IncomeExpenseBarChart({ data }: IncomeExpenseBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
        <Bar
          dataKey="income"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          animationBegin={0}
          animationDuration={800}
          name="Income"
        />
        <Bar
          dataKey="expense"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          animationBegin={200}
          animationDuration={800}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
