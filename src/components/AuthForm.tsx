import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react";
import AnimatedInput from "./ui/AnimatedInput";
import GradientButton from "./ui/GradientButton";
import GlassCard from "./ui/GlassCard";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes - normally this would connect to a backend
    if (formData.email && formData.password) {
      // Store user in localStorage for demo
      localStorage.setItem("trackify_user", JSON.stringify({
        name: formData.name || "Student",
        email: formData.email,
      }));
      
      toast({
        title: isLogin ? "Welcome back! 🎉" : "Account created! 🚀",
        description: "Redirecting to your dashboard...",
      });
      
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast({
        title: "Oops! 😅",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto p-8" hover={false}>
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold gradient-text mb-2">
          {isLogin ? "Welcome Back!" : "Join Trackify"}
        </h2>
        <p className="text-muted-foreground">
          {isLogin
            ? "Track your money like a pro 💸"
            : "Start your financial journey today ✨"}
        </p>
      </motion.div>

      {/* Toggle */}
      <div className="relative flex bg-muted/50 rounded-xl p-1 mb-8">
        <motion.div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-primary to-accent rounded-lg"
          animate={{ x: isLogin ? 0 : "calc(100% + 8px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors relative z-10 ${
            isLogin ? "text-primary-foreground" : "text-muted-foreground"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors relative z-10 ${
            !isLogin ? "text-primary-foreground" : "text-muted-foreground"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="name"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedInput
                name="name"
                label="Full Name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatedInput
          name="email"
          label="Email Address"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
        />

        <AnimatedInput
          name="password"
          label="Password"
          type="password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
        />

        <GradientButton type="submit" className="w-full group">
          <span className="flex items-center justify-center gap-2">
            {isLogin ? "Sign In" : "Create Account"}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </span>
        </GradientButton>
      </form>

      {/* Demo hint */}
      <motion.p
        className="text-center text-muted-foreground text-xs mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Demo mode: Enter any email/password to continue
      </motion.p>
    </GlassCard>
  );
};

export default AuthForm;
