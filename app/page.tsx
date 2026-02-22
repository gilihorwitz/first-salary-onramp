"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { COMPANY_NAME, EMPLOYEE_NAME, EMPLOYEE_ROLE } from "@/lib/mockSession";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 max-w-lg text-center z-10"
      >
        {/* Company branding */}
        <div className="flex items-center gap-3">
          <Image
            src="/meridian-logo.svg"
            alt={`${COMPANY_NAME} logo`}
            width={40}
            height={40}
          />
          <span className="text-muted-text text-sm font-medium tracking-wide uppercase">
            {COMPANY_NAME}
          </span>
        </div>

        {/* Greeting */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Welcome, {EMPLOYEE_NAME.split(" ")[0]}.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-muted-text text-lg"
          >
            {EMPLOYEE_ROLE} &middot; {COMPANY_NAME}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-white/80 leading-relaxed"
          >
            Let&apos;s decode your first paycheck.
          </motion.p>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Sparkles, label: "AI Benefit Optimizer", color: "text-neon" },
            { icon: Shield, label: "Paycheck Decoder", color: "text-electric" },
            { icon: CreditCard, label: "Smart Spending Card", color: "text-neon" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-white/5"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm text-white/70">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Link href="/salary-story">
            <Button
              size="lg"
              className="bg-neon text-background font-semibold text-base px-8 py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer"
            >
              See My Salary Story
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-xs text-muted-text/60 max-w-sm"
        >
          Your financial data stays on your device. Your employer only sees anonymized, aggregated insights.
        </motion.p>
      </motion.div>
    </main>
  );
}
