import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Trash2,
  Filter,
  Search,
  X,
  AlertTriangle,
  Calendar,
  IndianRupee,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useTransactions, formatCurrency } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const History = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = ["all", ...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filter === "all" || t.type === filter;
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || t.category === categoryFilter;
    return matchesType && matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, description: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction Deleted 🗑️",
      description: `"${description}" has been removed.`,
    });
  };

  const totalFiltered = filteredTransactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 md:pt-28 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
            Transaction History
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your transactions
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <GlassCard hover={false} className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Filtered Total</p>
                  <p className={`font-display text-2xl font-bold ${totalFiltered >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(Math.abs(totalFiltered))}
                    <span className="text-sm ml-1 text-muted-foreground">
                      ({totalFiltered >= 0 ? 'surplus' : 'deficit'})
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm">Showing</p>
                <p className="font-display text-lg font-semibold text-foreground">
                  {filteredTransactions.length} of {transactions.length}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/30 border-2 border-border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all duration-300"
            />
            {searchTerm && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 mr-2">
              <Filter size={18} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Type:</span>
            </div>
            {[
              { value: "all", label: "All", icon: null },
              { value: "income", label: "Income", icon: TrendingUp },
              { value: "expense", label: "Expense", icon: TrendingDown },
            ].map((type) => (
              <motion.button
                key={type.value}
                onClick={() => setFilter(type.value as typeof filter)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === type.value
                    ? type.value === "income"
                      ? "bg-success text-success-foreground shadow-[0_0_20px_hsl(var(--success)/0.3)]"
                      : type.value === "expense"
                      ? "bg-accent text-accent-foreground shadow-[0_0_20px_hsl(var(--accent)/0.3)]"
                      : "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type.icon && <type.icon size={16} />}
                {type.label}
              </motion.button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-2">
              <Calendar size={18} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">Category:</span>
            </div>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  categoryFilter === cat
                    ? "bg-secondary text-secondary-foreground shadow-[0_0_15px_hsl(var(--secondary)/0.3)]"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat === "all" ? "All Categories" : cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Transactions List */}
        <GlassCard hover={false} className="overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-border/50">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{ delay: 0.03 * index, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                          transaction.type === "income"
                            ? "bg-gradient-to-br from-success/20 to-success/5 border border-success/30"
                            : "bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30"
                        }`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-7 h-7 text-success" />
                        ) : (
                          <TrendingDown className="w-7 h-7 text-accent" />
                        )}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === "income" 
                              ? "bg-success/10 text-success border border-success/20" 
                              : "bg-accent/10 text-accent border border-accent/20"
                          }`}>
                            {transaction.category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.p
                        className={`font-display text-xl md:text-2xl font-bold ${
                          transaction.type === "income"
                            ? "text-success"
                            : "text-accent"
                        }`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount).replace('₹', '₹')}
                      </motion.p>
                      
                      {/* Delete Button with Confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <motion.button
                            className="opacity-0 group-hover:opacity-100 p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 border border-destructive/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              Delete Transaction?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              Are you sure you want to delete "<span className="text-foreground font-medium">{transaction.description}</span>"? 
                              <br />
                              <span className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-accent"}`}>
                                {formatCurrency(transaction.amount)}
                              </span> will be removed from your records.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(transaction.id, transaction.description)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="w-10 h-10 text-muted-foreground" />
                </motion.div>
                <p className="text-muted-foreground text-lg mb-2">
                  No transactions found 🔍
                </p>
                <p className="text-muted-foreground/60 text-sm mb-6">
                  Try adjusting your filters or search term
                </p>
                <GradientButton onClick={() => {
                  setFilter("all");
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}>
                  Clear All Filters
                </GradientButton>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </main>
    </div>
  );
};

export default History;
