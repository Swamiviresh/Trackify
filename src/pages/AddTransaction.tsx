import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Check,
  Utensils,
  Car,
  Home,
  Gamepad2,
  BookOpen,
  ShoppingBag,
  Briefcase,
  Gift,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import AnimatedInput from "@/components/ui/AnimatedInput";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";

const categories = [
  { name: "Food", icon: Utensils, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { name: "Travel", icon: Car, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { name: "Rent", icon: Home, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { name: "Fun", icon: Gamepad2, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  { name: "Study", icon: BookOpen, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { name: "Shopping", icon: ShoppingBag, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { name: "Part-time", icon: Briefcase, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { name: "Allowance", icon: Gift, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
];

const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please add a description";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      amount: parseFloat(formData.amount),
      type,
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    toast({
      title: "Transaction Added! 🎉",
      description: `${type === "income" ? "Income" : "Expense"} of ₹${parseFloat(formData.amount).toLocaleString('en-IN')} recorded.`,
    });

    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 md:pt-28 max-w-2xl">
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
            <span className="text-sm font-medium text-primary">New Entry</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
            Add Transaction
          </h1>
          <p className="text-muted-foreground mt-2">
            Record your income or expense in Rupees
          </p>
        </motion.div>

        <GlassCard hover={false} className="bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <IndianRupee size={16} className="text-primary" />
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "income", label: "Income", icon: TrendingUp, colorClass: "border-success bg-success/10 text-success shadow-[0_0_20px_hsl(var(--success)/0.3)]" },
                  { value: "expense", label: "Expense", icon: TrendingDown, colorClass: "border-accent bg-accent/10 text-accent shadow-[0_0_20px_hsl(var(--accent)/0.3)]" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value as "income" | "expense")}
                    className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                      type === option.value
                        ? option.colorClass
                        : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <option.icon size={20} />
                    <span className="font-semibold">{option.label}</span>
                    {type === option.value && (
                      <motion.div
                        layoutId="typeCheck"
                        className="absolute top-2 right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <AnimatedInput
              label="Amount (₹)"
              type="number"
              icon={IndianRupee}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              error={errors.amount}
              min="0"
              step="1"
            />

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.category === cat.name
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                        : "border-border bg-muted/30 hover:border-muted-foreground/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center border`}>
                      <cat.icon size={18} />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {cat.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {errors.category && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-destructive text-sm"
                  >
                    {errors.category}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <AnimatedInput
              label="Description"
              icon={FileText}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
            />

            {/* Date */}
            <AnimatedInput
              label="Date"
              type="date"
              icon={Calendar}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            {/* Submit */}
            <GradientButton
              type="submit"
              className="w-full"
              variant={type === "income" ? "secondary" : "primary"}
            >
              <span className="flex items-center justify-center gap-2">
                {type === "income" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                Add {type === "income" ? "Income" : "Expense"}
              </span>
            </GradientButton>
          </form>
        </GlassCard>
      </main>
    </div>
  );
};

export default AddTransaction;
