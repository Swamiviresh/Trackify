import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { IndianRupee, TrendingUp, TrendingDown, Percent } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/ui/GlassCard";
import { useTransactions, formatCurrency } from "@/hooks/useTransactions";

const COLORS = [
  "hsl(280, 100%, 65%)", // primary
  "hsl(190, 100%, 50%)", // secondary
  "hsl(320, 100%, 60%)", // accent
  "hsl(145, 100%, 50%)", // success
  "hsl(35, 100%, 55%)",  // warning
  "hsl(260, 100%, 60%)", // purple
  "hsl(200, 100%, 55%)", // blue
  "hsl(340, 100%, 60%)", // pink
];

const Analytics = () => {
  const { transactions, categoryBreakdown, totalIncome, totalExpenses } = useTransactions();

  // Pie chart data
  const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly data for bar and line charts
  const getMonthlyData = () => {
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  };

  const monthlyData = getMonthlyData();
  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-foreground font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm flex items-center gap-1">
              <span className="capitalize">{entry.name}:</span>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 md:pt-28 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize your spending habits
          </p>
        </motion.div>

        {transactions.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Category Breakdown - Pie Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard hover={false} className="h-full">
                <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    🍕
                  </span>
                  Spending by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-foreground text-sm">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Monthly Expenses - Bar Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard hover={false} className="h-full">
                <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    📊
                  </span>
                  Monthly Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-foreground text-sm capitalize">{value}</span>
                      )}
                    />
                    <Bar
                      dataKey="income"
                      fill="hsl(145, 100%, 50%)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="expense"
                      fill="hsl(320, 100%, 60%)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Income vs Expense Trend - Line Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <GlassCard hover={false}>
                <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    📈
                  </span>
                  Income vs Expense Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-foreground text-sm capitalize">{value}</span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="hsl(145, 100%, 50%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(145, 100%, 50%)", strokeWidth: 0, r: 5 }}
                      activeDot={{ r: 8 }}
                      animationDuration={2000}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="hsl(320, 100%, 60%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(320, 100%, 60%)", strokeWidth: 0, r: 5 }}
                      activeDot={{ r: 8 }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="grid sm:grid-cols-3 gap-4">
                <GlassCard className="text-center bg-gradient-to-br from-success/5 to-transparent border-success/20" glow="none">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <p className="text-muted-foreground text-sm">Total Income</p>
                  </div>
                  <p className="font-display text-3xl font-bold text-success">
                    {formatCurrency(totalIncome)}
                  </p>
                </GlassCard>
                <GlassCard className="text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20" glow="none">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-accent" />
                    <p className="text-muted-foreground text-sm">Total Expenses</p>
                  </div>
                  <p className="font-display text-3xl font-bold text-accent">
                    {formatCurrency(totalExpenses)}
                  </p>
                </GlassCard>
                <GlassCard className="text-center bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20" glow="none">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-secondary" />
                    <p className="text-muted-foreground text-sm">Savings Rate</p>
                  </div>
                  <p className="font-display text-3xl font-bold text-secondary">
                    {savingsRate}%
                  </p>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        ) : (
          <GlassCard hover={false}>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">
                No data to analyze yet 📭
              </p>
              <p className="text-muted-foreground text-sm">
                Add some transactions to see your analytics
              </p>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
};

export default Analytics;
