import { useState, useEffect } from "react";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
}

const STORAGE_KEY = "trackify_transactions";

// Demo transactions for first-time users (in Rupees)
const demoTransactions: Transaction[] = [
  {
    id: "1",
    amount: 15000,
    type: "income",
    category: "Allowance",
    description: "Monthly allowance from parents",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    amount: 850,
    type: "expense",
    category: "Food",
    description: "Weekly groceries",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    amount: 2500,
    type: "expense",
    category: "Study",
    description: "Textbooks for semester",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  },
  {
    id: "4",
    amount: 5000,
    type: "income",
    category: "Part-time",
    description: "Weekend tutoring",
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
  },
  {
    id: "5",
    amount: 600,
    type: "expense",
    category: "Fun",
    description: "Movie night with friends",
    date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
  },
  {
    id: "6",
    amount: 1200,
    type: "expense",
    category: "Travel",
    description: "Metro card recharge",
    date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
  },
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      // Initialize with demo data
      setTransactions(demoTransactions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTransactions));
    }
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryBreakdown = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    categoryBreakdown,
  };
};

// Currency formatter for Rupees
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
