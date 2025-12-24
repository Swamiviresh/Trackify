import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import GlassCard from "./ui/GlassCard";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent";
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }: FeatureCardProps) => {
  const colorStyles = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
    },
    secondary: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]",
    },
    accent: {
      bg: "bg-accent/10",
      text: "text-accent",
      glow: "group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
    },
  };

  const style = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <GlassCard className={`h-full ${style.glow} transition-all duration-500`} glow={color}>
        <motion.div
          className={`w-14 h-14 rounded-xl ${style.bg} flex items-center justify-center mb-4`}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-7 h-7 ${style.text}`} />
        </motion.div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        
        {/* Animated bottom border */}
        <motion.div
          className={`h-1 rounded-full mt-4 bg-gradient-to-r from-${color === "primary" ? "primary" : color === "secondary" ? "secondary" : "accent"} to-transparent`}
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.3 }}
        />
      </GlassCard>
    </motion.div>
  );
};

export default FeatureCard;
