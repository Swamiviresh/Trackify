"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence, ExpandCollapse, StaggerChildren, StaggerItem, CountUp } from "@/components/motion";

interface Debt {
  _id: string;
  friendName: string;
  amount: number;
  type: "lent" | "borrowed";
  status: "pending" | "settled";
  date: string;
  notes: string;
}

export default function FriendsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    friendName: "",
    amount: "",
    type: "lent" as "lent" | "borrowed",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const fetchDebts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.set("type", filterType);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/debts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDebts(data.debts || []);
      }
    } catch (error) {
      console.error("Failed to fetch debts:", error);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const resetForm = () => {
    setFormData({
      friendName: "",
      amount: "",
      type: "lent",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setShowForm(false);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.friendName.trim()) {
      setFormError("Please enter a friend name");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch("/api/debts", {
        method: "POST",
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
      fetchDebts();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSettle = async (id: string) => {
    try {
      const res = await fetch(`/api/debts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "settled" }),
      });
      if (res.ok) {
        fetchDebts();
      }
    } catch (error) {
      console.error("Failed to settle debt:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`/api/debts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDebts();
      }
    } catch (error) {
      console.error("Failed to delete debt:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalLent = debts
    .filter((d) => d.type === "lent" && d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalBorrowed = debts
    .filter((d) => d.type === "borrowed" && d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Friends - Lent & Borrowed
            </h1>
            <p className="text-muted mt-1">
              Track money lent to or borrowed from friends
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="btn-primary !py-2 !px-4 text-sm"
          >
            {showForm ? "Cancel" : "+ Add Record"}
          </button>
        </div>

        {/* Summary Cards */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StaggerItem><motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }} transition={{ duration: 0.2 }} className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted text-sm font-medium">
                Total Lent (Pending)
              </p>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-accent">
              <CountUp value={totalLent} />
            </p>
          </motion.div></StaggerItem>

          <StaggerItem><motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }} transition={{ duration: 0.2 }} className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted text-sm font-medium">
                Total Borrowed (Pending)
              </p>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-danger">
              <CountUp value={totalBorrowed} />
            </p>
          </motion.div></StaggerItem>
        </StaggerChildren>

        {/* Add Form */}
        <ExpandCollapse isOpen={showForm}>
          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Add New Record
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
                    Friend Name
                  </label>
                  <input
                    type="text"
                    value={formData.friendName}
                    onChange={(e) =>
                      setFormData({ ...formData, friendName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter friend's name"
                    required
                  />
                </div>

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
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "lent" | "borrowed",
                      })
                    }
                    className="input-field"
                  >
                    <option value="lent">Lent</option>
                    <option value="borrowed">Borrowed</option>
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
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="input-field"
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary !py-2 disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Add Record"}
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
            <option value="lent">Lent</option>
            <option value="borrowed">Borrowed</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field !w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="settled">Settled</option>
          </select>
        </div>

        {/* Debts Table */}
        <div className="card overflow-hidden !p-0">
          {loading ? (
            <div className="p-8 text-center text-muted">Loading...</div>
          ) : debts.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No records found. Add your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border bg-secondary/50">
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Friend Name
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Type
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted">
                      Date
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt, i) => (
                    <motion.tr
                      key={debt._id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="border-b border-card-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium">
                        {debt.friendName}
                        {debt.notes && (
                          <p className="text-xs text-muted mt-0.5">
                            {debt.notes}
                          </p>
                        )}
                      </td>
                      <td
                        className={`p-4 text-right font-semibold ${
                          debt.type === "lent" ? "text-accent" : "text-danger"
                        }`}
                      >
                        {formatCurrency(debt.amount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            debt.type === "lent"
                              ? "bg-green-100 dark:bg-green-900/30 text-accent"
                              : "bg-red-100 dark:bg-red-900/30 text-danger"
                          }`}
                        >
                          {debt.type === "lent" ? "Lent" : "Borrowed"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            debt.status === "settled"
                              ? "bg-green-100 dark:bg-green-900/30 text-accent"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-warning"
                          }`}
                        >
                          {debt.status === "settled" ? "Settled" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(debt.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {debt.status === "pending" && (
                            <button
                              onClick={() => handleSettle(debt._id)}
                              className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 text-muted hover:text-accent transition-colors"
                              title="Mark as Settled"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(debt._id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-muted hover:text-danger transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
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
