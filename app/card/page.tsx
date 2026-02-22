"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Wallet,
  PartyPopper,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VirtualCardFlip from "@/components/VirtualCardFlip";
import BottomNav from "@/components/BottomNav";
import {
  EMPLOYEE_NAME,
  monthlyNetPay,
  freeSpendBudget,
} from "@/lib/mockSession";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

type CardData = {
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  cardholder_name: string;
  spending_limit: number;
};

export default function CardPage() {
  const [phase, setPhase] = useState<"pre" | "minting" | "done">("pre");
  const [card, setCard] = useState<CardData | null>(null);
  const [walletAdded, setWalletAdded] = useState(false);

  const issueCard = async () => {
    setPhase("minting");

    try {
      const res = await fetch("/api/airwallex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardholderName: EMPLOYEE_NAME,
          spendLimit: freeSpendBudget,
        }),
      });
      const data = await res.json();
      // Wait for minting animation to finish (at least 2.5s)
      await new Promise((r) => setTimeout(r, 1800));
      setCard(data);
      setPhase("done");
    } catch {
      await new Promise((r) => setTimeout(r, 1800));
      setCard({
        card_number: "4242424242421234",
        expiry_month: "09",
        expiry_year: "2028",
        cvv: "314",
        cardholder_name: EMPLOYEE_NAME,
        spending_limit: freeSpendBudget,
      });
      setPhase("done");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 pb-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-2"
        >
          <Link href="/budget">
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
            Step 5 of 5
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Guilt-Free Spending
          </h1>
          <p className="text-muted-text">
            {phase === "done"
              ? "Your virtual card is live."
              : "Protect your take-home pay with a smart virtual card."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── PRE-ISSUE ── */}
          {phase === "pre" && (
            <motion.div
              key="pre-issue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Budget breakdown */}
              <div className="rounded-2xl bg-surface border border-white/5 p-6 space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-sm text-muted-text">
                    Your monthly take-home
                  </span>
                  <div className="text-4xl font-bold text-white">
                    {formatCurrency(monthlyNetPay)}
                  </div>
                </div>

                {/* Budget bar */}
                <div className="space-y-2">
                  <div className="h-3 bg-white/[0.03] rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-white/10 rounded-full"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "30%" }}
                      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-neon/40 to-neon/60 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-text">
                      Essentials ~{formatCurrency(monthlyNetPay - freeSpendBudget)}
                    </span>
                    <span className="text-neon font-semibold">
                      Free Spend {formatCurrency(freeSpendBudget)}
                    </span>
                  </div>
                </div>

                {/* Feature list */}
                <div className="grid gap-3 pt-2">
                  {[
                    {
                      icon: Wallet,
                      title: "Spending limit auto-set",
                      desc: "Card can\u2019t exceed your free-spend budget",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Essentials protected",
                      desc: "Rent, food & transport are untouchable",
                    },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl bg-background/50 border border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-neon" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/90">
                          {title}
                        </div>
                        <div className="text-xs text-muted-text">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issue CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={issueCard}
                  className="bg-neon text-background font-semibold text-base px-10 py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 mr-1" />
                  Protect My Spend
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ── MINTING ANIMATION ── */}
          {phase === "minting" && (
            <motion.div
              key="minting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-8 py-16"
            >
              {/* Card ghost with scanning effect */}
              <div className="relative w-72 aspect-[1.586/1]">
                {/* Card outline */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(57,255,20,0.1)",
                      "0 0 40px rgba(57,255,20,0.3)",
                      "0 0 20px rgba(57,255,20,0.1)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border-2 border-neon/40 bg-neon/5 backdrop-blur-md"
                />

                {/* Scanning line */}
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon to-transparent"
                />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ShieldCheck className="w-12 h-12 text-neon/60" />
                  </motion.div>
                </div>

                {/* Corner dots */}
                {[
                  "top-3 left-3",
                  "top-3 right-3",
                  "bottom-3 left-3",
                  "bottom-3 right-3",
                ].map((pos, i) => (
                  <motion.div
                    key={pos}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-neon`}
                  />
                ))}
              </div>

              {/* Progress text */}
              <div className="text-center space-y-2">
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-neon font-medium"
                >
                  Minting your virtual card...
                </motion.p>
                <p className="text-xs text-muted-text">
                  Connecting to Airwallex secure issuance
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-neon/60 to-neon rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* ── CARD REVEALED ── */}
          {phase === "done" && card && (
            <motion.div
              key="card-done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Success banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 text-neon"
              >
                <PartyPopper className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  Card minted successfully!
                </span>
              </motion.div>

              {/* The card */}
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ perspective: "1200px" }}
              >
                <VirtualCardFlip
                  cardNumber={card.card_number}
                  expiry={`${card.expiry_month}/${card.expiry_year.slice(-2)}`}
                  cvv={card.cvv}
                  cardholderName={card.cardholder_name}
                  spendLimit={card.spending_limit}
                />
              </motion.div>

              {/* Spending limit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="rounded-2xl bg-surface border border-neon/10 p-5 text-center space-y-2"
              >
                <div className="text-sm text-muted-text">
                  Monthly spending limit
                </div>
                <div className="text-3xl font-bold text-neon">
                  {formatCurrency(freeSpendBudget)}
                </div>
                <div className="text-xs text-muted-text">
                  Spend guilt-free — your essentials are protected.
                </div>
              </motion.div>

              {/* Apple Wallet */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="flex flex-col items-center gap-4"
              >
                <AnimatePresence mode="wait">
                  {!walletAdded ? (
                    <motion.button
                      key="wallet-btn"
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setWalletAdded(true)}
                      className="flex items-center gap-3 bg-white text-black font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/90 transition-all cursor-pointer"
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 170 170"
                        fill="currentColor"
                      >
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.93.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.04-7.1-9.18-15.33-12.42-24.72-3.47-10.14-5.21-19.97-5.21-29.47 0-10.89 2.35-20.27 7.06-28.13 3.69-6.31 8.6-11.3 14.75-14.95 6.15-3.66 12.79-5.52 19.95-5.7 3.91 0 9.04 1.21 15.43 3.59 6.37 2.39 10.46 3.6 12.25 3.6 1.34 0 5.87-1.42 13.55-4.25 7.27-2.63 13.4-3.72 18.42-3.28 13.62 1.1 23.84 6.47 30.62 16.14-12.18 7.38-18.19 17.72-18.07 31 .11 10.34 3.86 18.95 11.23 25.79 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.1-2.96 15.67-8.86 22.67-7.12 8.32-15.73 13.13-25.07 12.37a25.2 25.2 0 01-.19-3.07c0-7.78 3.39-16.09 9.4-22.89 3-3.44 6.82-6.31 11.45-8.6 4.62-2.26 8.99-3.51 13.1-3.72.12 1.1.17 2.2.17 3.24z" />
                      </svg>
                      Add to Apple Wallet
                    </motion.button>
                  ) : (
                    <motion.div
                      key="wallet-toast"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-2 px-5 py-3 rounded-full bg-neon/10 border border-neon/20"
                    >
                      <CheckCircle2 className="w-4 h-4 text-neon" />
                      <span className="text-sm text-neon font-medium">
                        Provisioned to Apple Wallet
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Go to Dashboard */}
              {walletAdded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col items-center gap-3 pt-4 border-t border-white/5"
                >
                  <p className="text-sm text-muted-text text-center max-w-sm">
                    Paycheck decoded. Benefits optimized. Spending protected.
                    Welcome to your financial dashboard.
                  </p>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-neon text-background font-semibold text-base px-8 py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </main>
  );
}
