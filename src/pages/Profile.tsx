import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Mail,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Award,
  Flame,
  Star,
  IndianRupee,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/ui/GlassCard";
import { useTransactions, formatCurrency } from "@/hooks/useTransactions";

const AnimatedNumber = ({ value, delay = 0, prefix = "₹" }: { value: number; delay?: number; prefix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      delay,
      ease: "easeOut",
    });
    
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, delay]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('en-IN')}
    </span>
  );
};

const Profile = () => {
  const { transactions, totalIncome, totalExpenses, balance } = useTransactions();
  const user = JSON.parse(localStorage.getItem("trackify_user") || '{"name": "Student", "email": "student@example.com"}');

  const transactionCount = transactions.length;
  const avgTransaction = transactionCount > 0 
    ? Math.round((totalIncome + totalExpenses) / transactionCount) 
    : 0;
  
  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;

  const achievements = [
    { 
      icon: Flame, 
      title: "Getting Started", 
      desc: "Added first transaction",
      earned: transactionCount >= 1,
      color: "text-orange-400"
    },
    { 
      icon: Star, 
      title: "Active Tracker", 
      desc: "5+ transactions logged",
      earned: transactionCount >= 5,
      color: "text-yellow-400"
    },
    { 
      icon: Target, 
      title: "Budget Master", 
      desc: "Maintained positive balance",
      earned: balance > 0,
      color: "text-green-400"
    },
    { 
      icon: Award, 
      title: "Super Saver", 
      desc: "20%+ savings rate",
      earned: savingsRate >= 20,
      color: "text-cyan-400"
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 md:pt-28 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard hover={false} className="text-center py-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
            <motion.div
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mb-4 shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-4xl font-display font-bold text-primary-foreground">
                {user.name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            </motion.div>
            <h1 className="font-display text-3xl font-bold gradient-text mb-2">
              {user.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Balance", value: balance, icon: Wallet, color: balance >= 0 ? "text-primary" : "text-destructive", prefix: "₹", bg: "from-primary/10" },
            { title: "Income", value: totalIncome, icon: TrendingUp, color: "text-success", prefix: "₹", bg: "from-success/10" },
            { title: "Expenses", value: totalExpenses, icon: TrendingDown, color: "text-accent", prefix: "₹", bg: "from-accent/10" },
            { title: "Transactions", value: transactionCount, icon: Target, color: "text-secondary", prefix: "", bg: "from-secondary/10" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <GlassCard className={`text-center bg-gradient-to-br ${stat.bg} to-transparent`}>
                <motion.div
                  className={`w-12 h-12 mx-auto rounded-xl bg-muted/50 flex items-center justify-center mb-3 border border-border/50`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </motion.div>
                <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
                <p className={`font-display text-2xl font-bold ${stat.color}`}>
                  <AnimatedNumber value={stat.value} delay={0.2 + index * 0.1} prefix={stat.prefix} />
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl font-bold mb-4 text-foreground flex items-center gap-2">
            <span className="text-2xl">💡</span> Quick Insights
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <GlassCard className="bg-gradient-to-br from-secondary/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                  <TrendingUp className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Savings Rate</p>
                  <p className="font-display text-2xl font-bold text-secondary">
                    {savingsRate}%
                  </p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <IndianRupee className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Avg. Transaction</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {formatCurrency(avgTransaction)}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-display text-xl font-bold mb-4 text-foreground flex items-center gap-2">
            <span className="text-2xl">🏆</span> Achievements
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <GlassCard 
                  className={`${!achievement.earned && "opacity-50 grayscale"} ${achievement.earned && "bg-gradient-to-br from-primary/5 to-transparent"}`}
                  glow={achievement.earned ? "primary" : "none"}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl ${achievement.earned ? "bg-primary/10 border border-primary/20" : "bg-muted/30"} flex items-center justify-center`}
                      animate={achievement.earned ? { 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <achievement.icon className={`w-6 h-6 ${achievement.earned ? achievement.color : "text-muted-foreground"}`} />
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                    </div>
                    {achievement.earned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="text-2xl">✅</span>
                      </motion.div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
