"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, ExpandCollapse } from "@/components/motion";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Travel",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  description: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    category: CATEGORIES[0],
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.set("type", filterType);
      if (filterCategory !== "all") params.set("category", filterCategory);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const resetForm = () => {
    setFormData({
      amount: "",
      category: CATEGORIES[0],
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    setFormLoading(true);

    try {
      const url = editingId
        ? `/api/transactions/${editingId}`
        : "/api/transactions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Something went wrong");
        return;
      }

      resetForm();
      fetchTransactions();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split("T")[0],
      description: transaction.description,
    });
    setEditingId(transaction._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trackify-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Transactions
            </h1>
            <p className="text-muted mt-1">Manage your income and expenses</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="btn-secondary !py-2 !px-4 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="btn-primary !py-2 !px-4 text-sm"
            >
              {showForm ? "Cancel" : "+ Add Transaction"}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        <ExpandCollapse isOpen={showForm}>
          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {editingId ? "Edit Transaction" : "Add New Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="input-field"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "income" | "expense",
                      })
                    }
                    className="input-field"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field"
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary !py-2 disabled:opacity-50"
                >
                  {formLoading
                    ? "Saving..."
                    : editingId
                    ? "Update Transaction"
                    : "Add Transaction"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary !py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </ExpandCollapse>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field !w-auto"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field !w-auto"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden !p-0">
          {loading ? (
            <div className="p-8 text-center text-muted">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No transactions found. Add your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border bg-secondary/50">
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Date
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Description
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Category
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Type
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted">
                      Amount
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, i) => (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="border-b border-card-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {transaction.description || "-"}
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900/30 text-accent"
                              : "bg-red-100 dark:bg-red-900/30 text-danger"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td
                        className={`p-4 text-right font-semibold ${
                          transaction.type === "income"
                            ? "text-accent"
                            : "text-danger"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 rounded-lg hover:bg-secondary text-muted hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-muted hover:text-danger transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
