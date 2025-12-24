import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import GlassCard from "./ui/GlassCard";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "success" | "destructive";
  delay?: number;
}

const StatCard = ({ title, value, prefix = "₹", icon: Icon, color, delay = 0 }: StatCardProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      delay: delay,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, delay]);

  const colorStyles = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/30",
      gradient: "from-primary/10",
    },
    secondary: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      border: "border-secondary/30",
      gradient: "from-secondary/10",
    },
    accent: {
      bg: "bg-accent/10",
      text: "text-accent",
      border: "border-accent/30",
      gradient: "from-accent/10",
    },
    success: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/30",
      gradient: "from-success/10",
    },
    destructive: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/30",
      gradient: "from-destructive/10",
    },
  };

  const style = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard 
        className={`border ${style.border} bg-gradient-to-br ${style.gradient} to-transparent`} 
        glow={color === "primary" || color === "secondary" || color === "accent" ? color : "none"}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-display font-bold ${style.text}`}>
                {prefix}
              </span>
              <motion.span className={`text-3xl font-display font-bold ${style.text}`}>
                {displayValue.toLocaleString('en-IN')}
              </motion.span>
            </div>
          </div>
          <motion.div
            className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center border ${style.border}`}
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            <Icon className={`w-6 h-6 ${style.text}`} />
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default StatCard;
