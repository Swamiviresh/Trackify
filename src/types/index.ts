export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  description: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface Debt {
  _id: string;
  userId: string;
  friendName: string;
  amount: number;
  type: "lent" | "borrowed";
  status: "pending" | "settled";
  date: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtFormData {
  friendName: string;
  amount: number;
  type: "lent" | "borrowed";
  date: string;
  notes: string;
}
