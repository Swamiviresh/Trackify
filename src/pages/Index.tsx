import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  PieChart,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
import FloatingShapes from "@/components/ui/FloatingShapes";
import AuthForm from "@/components/AuthForm";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    icon: Wallet,
    title: "Track Everything",
    description: "Log your income and expenses with just a few taps. Simple, fast, and intuitive.",
    color: "primary" as const,
  },
  {
    icon: TrendingUp,
    title: "Smart Categories",
    description: "Auto-categorize your spending into Food, Travel, Study, Fun, and more.",
    color: "secondary" as const,
  },
  {
    icon: PieChart,
    title: "Beautiful Charts",
    description: "Visualize where your money goes with stunning pie, bar, and line charts.",
    color: "accent" as const,
  },
  {
    icon: Zap,
    title: "Weekly Insights",
    description: "Get smart analysis of your spending habits every week.",
    color: "secondary" as const,
  },
  {
    icon: Sparkles,
    title: "Student-First",
    description: "Built specifically for college students. No complexity, just simplicity.",
    color: "primary" as const,
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data stays safe and private, always.",
    color: "accent" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FloatingShapes />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4">
        <div className="container mx-auto max-w-6xl z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Built for Students
                </span>
              </motion.div>

              <motion.h1
                className="font-display text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="gradient-text">Trackify</span>
                <br />
                <span className="text-foreground">Your Money,</span>
                <br />
                <span className="text-muted-foreground">Your Rules.</span>
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                The most fun way to manage your money as a college student. 
                Track, analyze, and master your finances. 💸
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex gap-8 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { value: "10K+", label: "Students" },
                  { value: "$2M+", label: "Tracked" },
                  { value: "4.9", label: "Rating" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-display font-bold gradient-text">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AuthForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Why Trackify? ✨
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Features</span> You'll Love
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your finances, 
              designed with students in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground text-sm">
            Made with 💜 for students everywhere
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
