"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  PiggyBank,
  HeartPulse,
  Train,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StagedActionCard from "@/components/StagedActionCard";
import BabelFishPanel from "@/components/BabelFishPanel";
import BottomNav from "@/components/BottomNav";
import { mockEmployee, EMPLOYEE_NAME } from "@/lib/mockSession";

type StagedAction = {
  type: string;
  currentPct: number;
  recommendedPct: number;
  annualGain: number;
  description: string;
};

const FALLBACK_ACTION: StagedAction = {
  type: "401k_increase",
  currentPct: 2,
  recommendedPct: 6,
  annualGain: 3400,
  description:
    "Increase your 401(k) contribution from 2% to 6% to capture your full employer match. You're leaving $3,400/year of free money on the table!",
};

const FALLBACK_MARKDOWN = `### Medical — PPO Gold
Your medical plan covers doctor visits, hospital stays, and prescriptions with a relatively low $500 deductible. For a new grad, this is solid coverage — you're protected if anything unexpected happens without huge out-of-pocket costs.

### Dental — Basic
This covers your routine cleanings (twice a year) and basic procedures like fillings. It's cheap and worth keeping — skipping the dentist now leads to expensive problems later.

### Vision — Standard
You get one eye exam per year plus an allowance for glasses or contacts. At $10/month it's a no-brainer, especially if you stare at screens all day.

### 401(k) Retirement
This is a retirement savings account where your company matches 100% of what you put in, up to 6% of your salary. Right now you're only contributing 2%, which means you're missing out on $3,400/year in free employer money — that's like turning down a raise.

### HSA — Health Savings Account
An HSA is a tax-free savings account you can use for medical expenses — and your employer is putting in $500/year for free. The money rolls over forever and after age 65 you can use it for anything, making it a stealth retirement account.

### Life Insurance — 1x Salary
Your employer pays for life insurance equal to one year of your salary ($85,000) at no cost to you. It's free protection for your family — nothing to do here, just know it's there.`;

type Recommendation = {
  icon: React.ElementType;
  title: string;
  saving: string;
  description: string;
  tag: string;
};

const recommendations: Recommendation[] = [
  {
    icon: PiggyBank,
    title: "401(k) Match",
    saving: "+$2,400/yr",
    description:
      "Reclaim $2,400/yr. Increase contribution to 6% to capture the full employer match.",
    tag: "High Impact",
  },
  {
    icon: HeartPulse,
    title: "HSA Strategy",
    saving: "+$1,200/yr",
    description:
      "Switching to the High Deductible plan (HDHP) saves you $1,200/year in premiums.",
    tag: "Tax Advantage",
  },
  {
    icon: Train,
    title: "Commuter Benefits",
    saving: "+$540/yr",
    description:
      "Save $45/mo by utilizing pre-tax transit funds.",
    tag: "Quick Win",
  },
];

export default function BenefitsPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [stagedAction, setStagedAction] = useState<StagedAction | null>(null);
  const [babelFishMarkdown, setBabelFishMarkdown] = useState("");
  const [optimized, setOptimized] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const hasStarted = useRef(false);

  const parseStream = useCallback((text: string) => {
    const actionMatch = text.match(
      /:::STAGED_ACTION:::\s*(\{[\s\S]*?\})\s*:::END_ACTION:::/
    );
    if (actionMatch) {
      try {
        const action = JSON.parse(actionMatch[1]);
        setStagedAction(action);
      } catch {
        // ignore
      }
    }
    const babelMatch = text.split("## Your Benefits, Explained");
    if (babelMatch.length > 1) {
      setBabelFishMarkdown(babelMatch[1].trim());
    }
  }, []);

  const finishAnalysis = useCallback(() => {
    setIsStreaming(false);
    setTimeout(() => setStreamDone(true), 400);
  }, []);

  const startAnalysis = useCallback(async () => {
    setIsStreaming(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          benefits: mockEmployee.benefitElections,
          grossSalary: mockEmployee.grossSalary,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("API error");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamedText(accumulated);
        parseStream(accumulated);
      }
      finishAnalysis();
    } catch {
      clearTimeout(timeout);
      setStagedAction(FALLBACK_ACTION);
      setBabelFishMarkdown(FALLBACK_MARKDOWN);
      finishAnalysis();
    }
  }, [parseStream, finishAnalysis]);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      const timer = setTimeout(startAnalysis, 800);
      return () => clearTimeout(timer);
    }
  }, [startAnalysis]);

  // Show CTA once results are visible
  useEffect(() => {
    if (streamDone) {
      const t = setTimeout(() => setShowCta(true), 1200);
      return () => clearTimeout(t);
    }
  }, [streamDone]);

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
          <Link href="/salary-story">
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
            Step 3 of 4
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-surface border border-electric/20">
            <Bot className="w-4 h-4 text-electric" />
            <span className="text-xs text-electric font-medium">
              AI Agent Active
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Benefit Optimization
          </h1>
          <p className="text-muted-text">
            {!streamDone
              ? `Scanning ${EMPLOYEE_NAME.split(" ")[0]}\u2019s benefits for uncaptured value\u2026`
              : `Found 3 ways to boost ${EMPLOYEE_NAME.split(" ")[0]}\u2019s take-home pay.`}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* ── AI SECTION ── */}
          {/* Staged Action Card (streams in) */}
          {stagedAction && (
            <StagedActionCard
              action={stagedAction}
              onConfirm={() => setOptimized(true)}
              onDismiss={() => setStagedAction(null)}
            />
          )}

          {optimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-neon/10 border border-neon/20 px-4 py-3 flex items-center gap-2"
            >
              <span className="text-neon text-sm font-medium">
                Benefits optimized — you&apos;ll capture an extra $3,400/yr in
                employer match.
              </span>
            </motion.div>
          )}

          {/* Babel Fish Panel */}
          {(babelFishMarkdown || isStreaming) && (
            <BabelFishPanel
              markdown={babelFishMarkdown}
              isStreaming={isStreaming}
            />
          )}

          {/* Initial spinner */}
          {isStreaming && !stagedAction && !babelFishMarkdown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-16"
            >
              <div className="relative w-20 h-20">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-electric/40"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="absolute inset-0 rounded-full border-2 border-neon/30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-electric" />
                </div>
              </div>
              <p className="text-sm text-muted-text">
                AI is analyzing your benefits...
              </p>
            </motion.div>
          )}

          {/* ── RESULTS (appear below AI content once streaming is done) ── */}
          <AnimatePresence>
            {streamDone && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Recommendation cards */}
                <div className="space-y-4">
                  {recommendations.map((rec, i) => {
                    const Icon = rec.icon;
                    return (
                      <motion.div
                        key={rec.title}
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: i * 0.15,
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-2xl border border-electric/25 bg-surface overflow-hidden hover:border-electric/40 transition-colors"
                      >
                        <div className="p-5 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-electric" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">
                                  {rec.title}
                                </h3>
                                <span className="text-xs text-electric/70">
                                  {rec.tag}
                                </span>
                              </div>
                            </div>
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.15 + 0.3 }}
                              className="text-lg font-bold text-neon"
                            >
                              {rec.saving}
                            </motion.span>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed pl-[52px]">
                            {rec.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total savings callout */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="rounded-2xl bg-neon/5 border border-neon/20 p-5 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-neon" />
                    <span className="text-sm text-muted-text">
                      Total annual savings potential
                    </span>
                  </div>
                  <span className="text-4xl font-bold text-neon">$4,140</span>
                  <span className="text-muted-text text-sm">/year</span>
                </motion.div>

                {/* CTA */}
                {showCta && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-4 pt-6 border-t border-white/5"
                  >
                    <p className="text-sm text-muted-text text-center max-w-md">
                      Benefits sorted. Now let&apos;s protect your take-home pay
                      with a smart spending card.
                    </p>
                    <Link href="/card">
                      <Button
                        size="lg"
                        className="bg-neon text-background font-semibold text-base px-8 py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer"
                      >
                        Get My Spending Card
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
