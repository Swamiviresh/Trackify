"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import MonthlyLineChart from "@/components/charts/MonthlyLineChart";
import IncomeExpenseBarChart from "@/components/charts/IncomeExpenseBarChart";
import LentBorrowedPieChart from "@/components/charts/LentBorrowedPieChart";
import type { CategoryData, MonthlyData } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#6366f1",
  Transportation: "#10b981",
  Housing: "#f59e0b",
  Utilities: "#ef4444",
  Entertainment: "#8b5cf6",
  Shopping: "#ec4899",
  Healthcare: "#14b8a6",
  Education: "#f97316",
  Travel: "#06b6d4",
  Other: "#84cc16",
};

export default function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [debtTotals, setDebtTotals] = useState({ lent: 0, borrowed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [res, debtsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/debts"),
      ]);

      if (debtsRes.ok) {
        const debtsData = await debtsRes.json();
        const allDebts = debtsData.debts || [];

        const lent = allDebts
          .filter((d: { type: string; status: string }) => d.type === "lent" && d.status === "pending")
          .reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);

        const borrowed = allDebts
          .filter((d: { type: string; status: string }) => d.type === "borrowed" && d.status === "pending")
          .reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);

        setDebtTotals({ lent, borrowed });
      }

      if (!res.ok) return;

      const data = await res.json();
      const transactions = data.transactions || [];

      // Category data (expenses only)
      const categoryMap: Record<string, number> = {};
      transactions
        .filter((t: { type: string }) => t.type === "expense")
        .forEach((t: { category: string; amount: number }) => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

      const catData: CategoryData[] = Object.entries(categoryMap).map(
        ([name, value]) => ({
          name,
          value,
          color: CATEGORY_COLORS[name] || "#94a3b8",
        })
      );
      setCategoryData(catData);

      // Monthly data
      const monthMap: Record<string, { income: number; expense: number }> = {};
      transactions.forEach(
        (t: { date: string; type: string; amount: number }) => {
          const d = new Date(t.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (!monthMap[key]) {
            monthMap[key] = { income: 0, expense: 0 };
          }
          if (t.type === "income") {
            monthMap[key].income += t.amount;
          } else {
            monthMap[key].expense += t.amount;
          }
        }
      );

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const mData: MonthlyData[] = Object.entries(monthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, values]) => ({
          month: months[parseInt(key.split("-")[1]) - 1] + " " + key.split("-")[0].slice(2),
          income: Math.round(values.income * 100) / 100,
          expense: Math.round(values.expense * 100) / 100,
        }));

      setMonthlyData(mData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-muted mt-1">
            Visualize your spending patterns and trends
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/3 mb-4" />
                <div className="h-64 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Expenses by Category
              </h2>
              <ExpensePieChart data={categoryData} />
            </div>

            {/* Bar Chart */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Income vs Expenses
              </h2>
              <IncomeExpenseBarChart data={monthlyData} />
            </div>

            {/* Lent vs Borrowed Pie Chart */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Lent vs Borrowed
              </h2>
              <LentBorrowedPieChart lent={debtTotals.lent} borrowed={debtTotals.borrowed} />
            </div>

            {/* Line Chart - full width */}
            <div className="card lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Monthly Spending Trend
              </h2>
              <MonthlyLineChart data={monthlyData} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
