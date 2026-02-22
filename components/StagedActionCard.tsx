"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowUpRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type StagedAction = {
  type: string;
  currentPct: number;
  recommendedPct: number;
  annualGain: number;
  description: string;
};

type StagedActionCardProps = {
  action: StagedAction;
  onConfirm: () => void;
  onDismiss: () => void;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function StagedActionCard({
  action,
  onConfirm,
  onDismiss,
}: StagedActionCardProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(onConfirm, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-neon/30 bg-surface overflow-hidden"
    >
      {/* Header strip */}
      <div className="bg-neon/10 px-5 py-3 flex items-center gap-2 border-b border-neon/20">
        <Sparkles className="w-4 h-4 text-neon" />
        <span className="text-sm font-semibold text-neon">
          AI Recommendation
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed">
          {action.description}
        </p>

        {/* Diff-style preview */}
        <div className="rounded-xl bg-background/50 border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-text uppercase tracking-wider">
              401(k) Contribution
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Current */}
            <div className="flex-1 rounded-lg bg-danger/10 border border-danger/20 p-3 text-center">
              <div className="text-xs text-danger/80 mb-1">Current</div>
              <div className="text-2xl font-bold text-danger">
                {action.currentPct}%
              </div>
              <div className="text-xs text-muted-text mt-1">
                {formatCurrency((action.currentPct / 100) * 85000)}/yr
              </div>
            </div>

            {/* Arrow */}
            <ArrowUpRight className="w-5 h-5 text-neon shrink-0" />

            {/* Recommended */}
            <div className="flex-1 rounded-lg bg-neon/10 border border-neon/20 p-3 text-center">
              <div className="text-xs text-neon/80 mb-1">Recommended</div>
              <div className="text-2xl font-bold text-neon">
                {action.recommendedPct}%
              </div>
              <div className="text-xs text-muted-text mt-1">
                {formatCurrency((action.recommendedPct / 100) * 85000)}/yr
              </div>
            </div>
          </div>

          {/* Gain callout */}
          <div className="text-center pt-1">
            <span className="text-sm text-electric font-semibold">
              +{formatCurrency(action.annualGain)}/yr
            </span>
            <span className="text-sm text-muted-text"> in employer match</span>
          </div>
        </div>

        {/* Action buttons */}
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div
              key="buttons"
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-3"
            >
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-neon text-background font-semibold rounded-xl hover:bg-neon/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.25)] transition-all duration-300 cursor-pointer"
              >
                <Check className="w-4 h-4 mr-1.5" />
                Confirm Change
              </Button>
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="text-muted-text hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-2 text-neon"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold">
                401(k) updated to {action.recommendedPct}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
