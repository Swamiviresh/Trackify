"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface BudgetData {
  budget: number;
  totalExpenses: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    Array<{
      _id: string;
      description: string;
      amount: number;
      type: string;
      category: string;
      date: string;
    }>
  >([]);
  const [debtStats, setDebtStats] = useState({ totalLent: 0, totalBorrowed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [transRes, budgetRes, debtsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budget"),
        fetch("/api/debts"),
      ]);

      if (transRes.ok) {
        const transData = await transRes.json();
        const transactions = transData.transactions || [];

        const totalIncome = transactions
          .filter((t: { type: string }) => t.type === "income")
          .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

        const totalExpenses = transactions
          .filter((t: { type: string }) => t.type === "expense")
          .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

        setStats({
          totalBalance: totalIncome - totalExpenses,
          totalIncome,
          totalExpenses,
        });

        setRecentTransactions(transactions.slice(0, 5));
      }

      if (budgetRes.ok) {
        const bData = await budgetRes.json();
        setBudgetData(bData);
      }

      if (debtsRes.ok) {
        const debtsData = await debtsRes.json();
        const allDebts = debtsData.debts || [];

        const totalLent = allDebts
          .filter((d: { type: string; status: string }) => d.type === "lent" && d.status === "pending")
          .reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);

        const totalBorrowed = allDebts
          .filter((d: { type: string; status: string }) => d.type === "borrowed" && d.status === "pending")
          .reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);

        setDebtStats({ totalLent, totalBorrowed });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {session?.user?.name || "User"}
          </h1>
          <p className="text-muted mt-1">
            Here&apos;s an overview of your finances
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/2 mb-4" />
                <div className="h-8 bg-secondary rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted text-sm font-medium">Total Balance</p>
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className={`text-3xl font-bold ${stats.totalBalance >= 0 ? "text-accent" : "text-danger"}`}>
                  {formatCurrency(stats.totalBalance)}
                </p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted text-sm font-medium">Total Income</p>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-accent">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted text-sm font-medium">Total Expenses</p>
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-danger">
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted text-sm font-medium">Total Lent</p>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-accent">
                  {formatCurrency(debtStats.totalLent)}
                </p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted text-sm font-medium">Total Borrowed</p>
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-danger">
                  {formatCurrency(debtStats.totalBorrowed)}
                </p>
              </div>
            </div>

            {/* Budget Alert */}
            {budgetData && budgetData.budget > 0 && (
              <div
                className={`card border-l-4 ${
                  budgetData.isOverBudget
                    ? "border-l-danger bg-red-50 dark:bg-red-950/20"
                    : budgetData.percentUsed > 80
                    ? "border-l-warning bg-yellow-50 dark:bg-yellow-950/20"
                    : "border-l-accent bg-green-50 dark:bg-green-950/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">
                    Monthly Budget
                  </h3>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      budgetData.isOverBudget
                        ? "bg-red-100 dark:bg-red-900 text-danger"
                        : budgetData.percentUsed > 80
                        ? "bg-yellow-100 dark:bg-yellow-900 text-warning"
                        : "bg-green-100 dark:bg-green-900 text-accent"
                    }`}
                  >
                    {budgetData.percentUsed.toFixed(0)}% used
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      budgetData.isOverBudget
                        ? "bg-danger"
                        : budgetData.percentUsed > 80
                        ? "bg-warning"
                        : "bg-accent"
                    }`}
                    style={{
                      width: `${Math.min(budgetData.percentUsed, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted">
                  <span>
                    Spent: {formatCurrency(budgetData.totalExpenses)}
                  </span>
                  <span>Budget: {formatCurrency(budgetData.budget)}</span>
                </div>
                {budgetData.isOverBudget && (
                  <p className="text-danger text-sm mt-2 font-medium">
                    You have exceeded your monthly budget by{" "}
                    {formatCurrency(Math.abs(budgetData.remaining))}!
                  </p>
                )}
              </div>
            )}

            {/* Recent Transactions */}
            <div className="card">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Recent Transactions
              </h2>
              {recentTransactions.length === 0 ? (
                <p className="text-muted text-center py-8">
                  No transactions yet. Add your first transaction!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description || transaction.category}
                          </p>
                          <p className="text-sm text-muted">
                            {transaction.category} &middot;{" "}
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-accent"
                            : "text-danger"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
