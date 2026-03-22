"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, AnimatedCard } from "@/components/motion";

const heroWords = ["Track", "Your", "Expenses"];

const features = [
  {
    title: "Track Expenses",
    description:
      "Easily log and categorize all your income and expenses in one place.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "Smart Analytics",
    description:
      "Visualize your spending patterns with interactive charts and insights.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Budget Management",
    description:
      "Set monthly budgets and get alerts when you're close to exceeding them.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Export Data",
    description:
      "Download your financial data as CSV for external analysis or records.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Secure & Private",
    description:
      "Your data is protected with industry-standard authentication and encryption.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Dark Mode",
    description:
      "Easy on the eyes with full dark mode support throughout the application.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-card-border bg-card/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-foreground">Trackify</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-muted hover:text-foreground font-medium transition-colors"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Smart Financial Tracking
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              {heroWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.56 }}
                className="text-primary inline-block"
              >
                Smarter
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
            >
              Take control of your finances with powerful analytics, budget
              tracking, and beautiful visualizations. Your complete financial
              dashboard in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(99,102,241,0.35)" }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" className="btn-primary text-lg !py-4 !px-8">
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/login" className="btn-secondary text-lg !py-4 !px-8">
                  Login to Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage your finances
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Powerful features designed to help you understand and optimize your
              spending habits.
            </p>
          </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.08}>
                <AnimatedCard className="card group h-full">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted">{feature.description}</p>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <ScrollReveal>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already tracking their expenses smarter
            with Trackify.
          </p>
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(99,102,241,0.35)" }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link href="/signup" className="btn-primary text-lg !py-4 !px-8">
              Start Tracking Now
            </Link>
          </motion.div>
        </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-card-border bg-card py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-foreground">Trackify</span>
            </div>
            <div className="flex items-center gap-6 text-muted text-sm">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
            </div>
            <p className="text-muted text-sm">
              &copy; {new Date().getFullYear()} Trackify. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
