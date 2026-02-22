"use client";

import { motion } from "framer-motion";

type PaycheckHealthRingProps = {
  currentNetPay: number;
  optimizedPotential: number;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function PaycheckHealthRing({
  currentNetPay,
  optimizedPotential,
}: PaycheckHealthRingProps) {
  const percentage = Math.round((currentNetPay / optimizedPotential) * 100);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        <svg
          width="192"
          height="192"
          viewBox="0 0 192 192"
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Optimized potential (full ring, dimmed) */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke="rgba(125,249,255,0.12)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Current net pay (animated arc) */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#39FF14" />
              <stop offset="100%" stopColor="#7DF9FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-3xl font-bold text-neon"
          >
            {percentage}%
          </motion.span>
          <span className="text-xs text-muted-text">Optimized</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-center">
        <div>
          <div className="text-xs text-muted-text mb-0.5">Current Net</div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(currentNetPay)}
          </div>
        </div>
        <div className="w-px bg-white/10" />
        <div>
          <div className="text-xs text-muted-text mb-0.5">Potential</div>
          <div className="text-lg font-bold text-electric">
            {formatCurrency(optimizedPotential)}
          </div>
        </div>
      </div>
    </div>
  );
}
