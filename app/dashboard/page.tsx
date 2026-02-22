"use client";

import { motion } from "framer-motion";
import {
  PiggyBank,
  CreditCard,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PaycheckHealthRing from "@/components/PaycheckHealthRing";
import BottomNav from "@/components/BottomNav";
import {
  mockEmployee,
  EMPLOYEE_NAME,
  COMPANY_NAME,
  COMPANY_LOGO,
  freeSpendBudget,
} from "@/lib/mockSession";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const optimizedNetPay = mockEmployee.netPay + 4140; // $4,140 annual savings from benefits optimization

type ActionTile = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  href: string;
  accent: "neon" | "electric";
  badge?: string;
};

const actionTiles: ActionTile[] = [
  {
    icon: PiggyBank,
    title: "Optimize 401k",
    subtitle: "Capture your full employer match",
    href: "/benefits",
    accent: "neon",
    badge: "+$2,400/yr",
  },
  {
    icon: CreditCard,
    title: "Virtual Card Settings",
    subtitle: `${formatCurrency(freeSpendBudget)}/mo spending limit`,
    href: "/card",
    accent: "electric",
  },
  {
    icon: Sparkles,
    title: "AI Financial Co-pilot",
    subtitle: "Ask anything about your paycheck",
    href: "/benefits",
    accent: "neon",
    badge: "AI",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen pb-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[100px] right-[-100px] w-[300px] h-[300px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-lg mx-auto px-6 pt-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Image
              src={COMPANY_LOGO}
              alt={COMPANY_NAME}
              width={32}
              height={32}
            />
            <div>
              <h1 className="text-lg font-bold">
                Hey, {EMPLOYEE_NAME.split(" ")[0]}
              </h1>
              <p className="text-xs text-muted-text">{COMPANY_NAME}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon/10 border border-neon/20">
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            <span className="text-xs text-neon font-medium">All Clear</span>
          </div>
        </motion.div>

        {/* Paycheck Health Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-2xl bg-surface border border-white/5 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-electric" />
            <h2 className="text-sm font-semibold text-white/80">
              Paycheck Health
            </h2>
          </div>
          <PaycheckHealthRing
            currentNetPay={mockEmployee.netPay}
            optimizedPotential={optimizedNetPay}
          />
        </motion.div>

        {/* Quick stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            {
              label: "Net Pay",
              value: formatCurrency(mockEmployee.netPay),
              color: "text-white",
            },
            {
              label: "Free Spend",
              value: `${formatCurrency(freeSpendBudget)}/mo`,
              color: "text-neon",
            },
            {
              label: "Savings Found",
              value: "$4,140/yr",
              color: "text-electric",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="rounded-xl bg-surface border border-white/5 p-3 text-center"
            >
              <div className="text-[10px] text-muted-text uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className={`text-sm font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon" />
            <h2 className="text-sm font-semibold text-white/80">
              Quick Actions
            </h2>
          </div>

          {actionTiles.map((tile, i) => {
            const Icon = tile.icon;
            const isNeon = tile.accent === "neon";
            return (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.55 + i * 0.1,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={tile.href}>
                  <div className="group rounded-2xl bg-surface border border-white/5 hover:border-white/10 p-4 flex items-center gap-4 transition-all cursor-pointer">
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isNeon
                          ? "bg-neon/10 border border-neon/20"
                          : "bg-electric/10 border border-electric/20"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isNeon ? "text-neon" : "text-electric"
                        }`}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white/90">
                          {tile.title}
                        </span>
                        {tile.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isNeon
                                ? "bg-neon/15 text-neon"
                                : "bg-electric/15 text-electric"
                            }`}
                          >
                            {tile.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-text">
                        {tile.subtitle}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
