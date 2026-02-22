"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, TrendingUp, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EMPLOYEE_NAME, mockEmployee } from "@/lib/mockSession";

const optimizedNetPay = mockEmployee.netPay + 4140;
const monthlyNet = Math.round(optimizedNetPay / 12);

type Category = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  defaultPct: number;
  min: number;
  max: number;
};

const categories: Category[] = [
  {
    id: "essentials",
    label: "Essentials (Rent/Bills)",
    icon: Home,
    color: "text-white",
    borderColor: "border-white/20",
    bgColor: "bg-white/10",
    defaultPct: 50,
    min: 30,
    max: 70,
  },
  {
    id: "investing",
    label: "Investing",
    icon: TrendingUp,
    color: "text-electric",
    borderColor: "border-electric/20",
    bgColor: "bg-electric/10",
    defaultPct: 20,
    min: 5,
    max: 40,
  },
  {
    id: "freeSpend",
    label: "Guilt-Free Spending",
    icon: Sparkles,
    color: "text-neon",
    borderColor: "border-neon/20",
    bgColor: "bg-neon/10",
    defaultPct: 30,
    min: 10,
    max: 50,
  },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function BudgetPage() {
  const router = useRouter();
  const [pcts, setPcts] = useState<Record<string, number>>({
    essentials: 50,
    investing: 20,
    freeSpend: 30,
  });
  const [locked, setLocked] = useState(false);

  const totalPct = useMemo(
    () => Object.values(pcts).reduce((a, b) => a + b, 0),
    [pcts]
  );

  const handleSlider = (id: string, value: number) => {
    setPcts((prev) => ({ ...prev, [id]: value }));
  };

  const handleLock = () => {
    setLocked(true);
    setTimeout(() => router.push("/card"), 800);
  };

  const isBalanced = totalPct === 100;

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 pb-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-2"
        >
          <Link href="/benefits">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-text hover:text-white gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <span className="text-xs text-muted-text uppercase tracking-widest">
            Step 4 of 5
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Budget Blueprint
          </h1>
          <p className="text-muted-text">
            Divide {EMPLOYEE_NAME.split(" ")[0]}&apos;s optimized take-home of{" "}
            <span className="text-neon font-semibold">
              {formatCurrency(monthlyNet)}/mo
            </span>
          </p>
        </motion.div>

        {/* Sliders */}
        <div className="space-y-6 mb-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const amount = Math.round((pcts[cat.id] / 100) * monthlyNet);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className={`rounded-2xl bg-surface border ${cat.borderColor} p-5 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${cat.bgColor} border ${cat.borderColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {cat.label}
                      </h3>
                      <span className="text-xs text-muted-text">
                        {pcts[cat.id]}%
                      </span>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${cat.color}`}>
                    {formatCurrency(amount)}
                  </span>
                </div>

                {/* Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min={cat.min}
                    max={cat.max}
                    value={pcts[cat.id]}
                    onChange={(e) =>
                      handleSlider(cat.id, parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/5
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)] [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)] [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${
                        cat.id === "freeSpend"
                          ? "#39FF14"
                          : cat.id === "investing"
                          ? "#7DF9FF"
                          : "rgba(255,255,255,0.4)"
                      } ${((pcts[cat.id] - cat.min) / (cat.max - cat.min)) * 100}%, rgba(255,255,255,0.05) ${((pcts[cat.id] - cat.min) / (cat.max - cat.min)) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-muted-text mt-1">
                    <span>{cat.min}%</span>
                    <span>{cat.max}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl border p-4 text-center mb-8 ${
            isBalanced
              ? "bg-neon/5 border-neon/20"
              : "bg-danger/5 border-danger/20"
          }`}
        >
          <span
            className={`text-sm font-medium ${
              isBalanced ? "text-neon" : "text-danger"
            }`}
          >
            {isBalanced
              ? "Budget balanced — 100% allocated"
              : `${totalPct}% allocated — adjust to reach 100%`}
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleLock}
            disabled={!isBalanced || locked}
            className="bg-neon text-background font-semibold text-base px-10 py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {locked ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Budget Locked!
              </motion.span>
            ) : (
              <>
                Lock In Budget
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
