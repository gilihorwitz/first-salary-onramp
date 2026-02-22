"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Building2,
  Landmark,
  Shield,
  Heart,
  PiggyBank,
  ArrowDown,
} from "lucide-react";

type WaterfallItem = {
  label: string;
  amount: number;
  type: "start" | "deduction" | "result";
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

type WaterfallChartProps = {
  grossSalary: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  healthPremium: number;
  retirement401k: number;
  netPay: number;
  onComplete?: () => void;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function WaterfallChart({
  grossSalary,
  federalTax,
  stateTax,
  ficaTax,
  healthPremium,
  retirement401k,
  netPay,
  onComplete,
}: WaterfallChartProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showNetPay, setShowNetPay] = useState(false);

  const items: WaterfallItem[] = [
    {
      label: "Gross Salary",
      amount: grossSalary,
      type: "start",
      icon: DollarSign,
      color: "text-neon",
      bgColor: "bg-neon/10 border-neon/20",
    },
    {
      label: "Federal Tax",
      amount: federalTax,
      type: "deduction",
      icon: Landmark,
      color: "text-danger",
      bgColor: "bg-danger/10 border-danger/20",
    },
    {
      label: "State Tax",
      amount: stateTax,
      type: "deduction",
      icon: Building2,
      color: "text-danger",
      bgColor: "bg-danger/10 border-danger/20",
    },
    {
      label: "FICA (Social Security + Medicare)",
      amount: ficaTax,
      type: "deduction",
      icon: Shield,
      color: "text-danger",
      bgColor: "bg-danger/10 border-danger/20",
    },
    {
      label: "Health Insurance",
      amount: healthPremium,
      type: "deduction",
      icon: Heart,
      color: "text-electric",
      bgColor: "bg-electric/10 border-electric/20",
    },
    {
      label: "401(k) Contribution",
      amount: retirement401k,
      type: "deduction",
      icon: PiggyBank,
      color: "text-electric",
      bgColor: "bg-electric/10 border-electric/20",
    },
  ];

  // Stagger reveal of each deduction row
  useEffect(() => {
    if (visibleCount < items.length) {
      const timer = setTimeout(
        () => setVisibleCount((c) => c + 1),
        visibleCount === 0 ? 600 : 500
      );
      return () => clearTimeout(timer);
    } else {
      // All deductions shown — reveal net pay after a pause
      const timer = setTimeout(() => {
        setShowNetPay(true);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, items.length, onComplete]);

  // Running total for the bar width
  let runningTotal = grossSalary;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <AnimatePresence>
        {items.slice(0, visibleCount).map((item, i) => {
          const barPercent =
            item.type === "start"
              ? 100
              : ((runningTotal - item.amount) / grossSalary) * 100;

          if (item.type === "deduction") {
            runningTotal -= item.amount;
          }

          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="space-y-1.5"
            >
              {/* Row label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg ${item.bgColor} border flex items-center justify-center`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-sm text-white/80">{item.label}</span>
                </div>
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className={`text-sm font-mono font-semibold ${
                    item.type === "deduction" ? "text-danger" : item.color
                  }`}
                >
                  {item.type === "deduction" ? "−" : ""}
                  {formatCurrency(item.amount)}
                </motion.span>
              </div>

              {/* Bar */}
              <div className="h-8 bg-white/[0.03] rounded-xl overflow-hidden relative">
                <motion.div
                  initial={{ width: i === 0 ? "0%" : `${(runningTotal + item.amount) / grossSalary * 100}%` }}
                  animate={{
                    width: i === 0 ? "100%" : `${barPercent}%`,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                  className={`h-full rounded-xl ${
                    item.type === "start"
                      ? "bg-gradient-to-r from-neon/30 to-neon/10"
                      : "bg-gradient-to-r from-white/10 to-white/5"
                  }`}
                />
                {/* Deduction chunk indicator */}
                {item.type === "deduction" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="absolute right-0 top-0 h-full bg-danger/15 rounded-r-xl"
                    style={{
                      width: `${(item.amount / grossSalary) * 100}%`,
                    }}
                  />
                )}
              </div>

              {/* Connector arrow between rows */}
              {item.type === "deduction" && i < items.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-white/15" />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* NET PAY reveal */}
      <AnimatePresence>
        {showNetPay && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            {/* Divider arrow */}
            <div className="flex justify-center -mt-9 mb-3">
              <div className="bg-background px-3">
                <ArrowDown className="w-5 h-5 text-neon" />
              </div>
            </div>

            <div className="relative rounded-2xl bg-surface border border-neon/20 p-6 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon/5 via-transparent to-electric/5 pointer-events-none" />

              <div className="relative flex flex-col items-center gap-2">
                <span className="text-sm text-muted-text uppercase tracking-widest">
                  Your Take-Home Pay
                </span>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="text-5xl md:text-6xl font-bold text-neon tracking-tight"
                >
                  {formatCurrency(netPay)}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="flex items-center gap-3 mt-1"
                >
                  <span className="text-sm text-muted-text">
                    {formatCurrency(Math.round(netPay / 12))}/mo
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-danger">
                    {Math.round(((grossSalary - netPay) / grossSalary) * 100)}%
                    deducted
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
