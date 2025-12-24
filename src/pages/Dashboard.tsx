import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowRight, IndianRupee, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useTransactions, formatCurrency } from "@/hooks/useTransactions";

const Dashboard = () => {
  const { transactions, totalIncome, totalExpenses, balance } = useTransactions();
  const recentTransactions = transactions.slice(0, 5);

  const user = JSON.parse(localStorage.getItem("trackify_user") || '{"name": "Student"}');

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 md:pt-28 max-w-6xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">Welcome back!</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Hey, <span className="gradient-text">{user.name}!</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your financial overview for today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Balance"
            value={balance}
            prefix="₹"
            icon={Wallet}
            color={balance >= 0 ? "primary" : "destructive"}
            delay={0}
          />
          <StatCard
            title="Total Income"
            value={totalIncome}
            prefix="₹"
            icon={TrendingUp}
            color="success"
            delay={0.1}
          />
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            prefix="₹"
            icon={TrendingDown}
            color="accent"
            delay={0.2}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-2 gap-4 mb-8"
        >
          <Link to="/add">
            <GlassCard className="flex items-center justify-between group bg-gradient-to-br from-primary/5 to-transparent border-primary/20" glow="primary">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Add Transaction
                </h3>
                <p className="text-muted-foreground text-sm">
                  Record income or expense
                </p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"
                whileHover={{ x: 5, scale: 1.1 }}
              >
                <ArrowRight className="w-5 h-5 text-primary" />
              </motion.div>
            </GlassCard>
          </Link>
          <Link to="/analytics">
            <GlassCard className="flex items-center justify-between group bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20" glow="secondary">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  View Analytics
                </h3>
                <p className="text-muted-foreground text-sm">
                  See your spending charts
                </p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20"
                whileHover={{ x: 5, scale: 1.1 }}
              >
                <ArrowRight className="w-5 h-5 text-secondary" />
              </motion.div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              Recent Transactions
            </h2>
            <Link to="/history">
              <GradientButton variant="outline" size="sm">
                View All
              </GradientButton>
            </Link>
          </div>

          <GlassCard hover={false}>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-gradient-to-br from-success/20 to-success/5 border border-success/30"
                            : "bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30"
                        }`}
                        whileHover={{ rotate: 10, scale: 1.05 }}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-success" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-accent" />
                        )}
                      </motion.div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            transaction.type === "income" 
                              ? "bg-success/10 text-success" 
                              : "bg-accent/10 text-accent"
                          }`}>
                            {transaction.category}
                          </span>
                          <span className="ml-2">{transaction.date}</span>
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-display font-bold text-lg ${
                        transaction.type === "income"
                          ? "text-success"
                          : "text-accent"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No transactions yet. Start tracking!
                </p>
                <Link to="/add">
                  <GradientButton>Add First Transaction</GradientButton>
                </Link>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
