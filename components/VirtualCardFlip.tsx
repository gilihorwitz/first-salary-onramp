"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Wifi, Copy, Check } from "lucide-react";
import Image from "next/image";

type VirtualCardFlipProps = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
  spendLimit: number;
};

const formatCardNumber = (n: string) =>
  n.replace(/(.{4})/g, "$1 ").trim();

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function VirtualCardFlip({
  cardNumber,
  expiry,
  cvv,
  cardholderName,
  spendLimit,
}: VirtualCardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card container with perspective */}
      <div
        className="relative w-full aspect-[1.586/1] cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          {/* ── FRONT ── Neon Green Glassmorphism */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full relative p-6 flex flex-col justify-between">
              {/* Glass layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon/20 via-neon/8 to-electric/10 rounded-2xl" />
              <div className="absolute inset-0 backdrop-blur-xl rounded-2xl" />
              <div className="absolute inset-0 border border-neon/30 rounded-2xl" />
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl pointer-events-none" />
              {/* Glow orbs */}
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-neon/15 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 bg-electric/10 rounded-full blur-[40px] pointer-events-none" />

              {/* Top row */}
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/meridian-logo.svg"
                    alt="Meridian"
                    width={24}
                    height={24}
                  />
                  <div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">
                      Guilt-Free Spending
                    </div>
                    <div className="text-xs text-neon font-semibold">
                      {formatCurrency(spendLimit)}/mo
                    </div>
                  </div>
                </div>
                <Wifi className="w-5 h-5 text-white/30 rotate-90" />
              </div>

              {/* Chip */}
              <div className="relative">
                <div className="w-11 h-8 rounded-md bg-gradient-to-br from-neon/40 to-neon/20 border border-neon/30 shadow-[0_0_12px_rgba(57,255,20,0.15)]" />
              </div>

              {/* Card number + details */}
              <div className="relative space-y-3">
                <div className="text-lg md:text-xl font-mono tracking-[0.18em] text-white/95">
                  {formatCardNumber(cardNumber)}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[9px] text-white/35 uppercase tracking-wider">
                      Cardholder
                    </div>
                    <div className="text-xs text-white/80 font-medium tracking-wide">
                      {cardholderName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-white/35 uppercase tracking-wider">
                      Expires
                    </div>
                    <div className="text-xs text-white/80 font-mono">
                      {expiry}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    <div className="w-5 h-5 rounded-full bg-neon/50" />
                    <div className="w-5 h-5 rounded-full bg-electric/40 -ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BACK ── */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="w-full h-full relative flex flex-col">
              {/* Glass layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon/15 via-neon/5 to-electric/8 rounded-2xl" />
              <div className="absolute inset-0 backdrop-blur-xl rounded-2xl" />
              <div className="absolute inset-0 border border-neon/25 rounded-2xl" />

              {/* Magnetic stripe */}
              <div className="relative w-full h-10 bg-black/40 mt-6" />

              {/* Signature + CVV */}
              <div className="relative flex items-center gap-3 px-6 mt-4">
                <div className="flex-1 h-8 bg-white/8 rounded-sm" />
                <div className="bg-neon/90 text-background px-3 py-1 rounded text-sm font-mono font-bold">
                  {cvv}
                </div>
              </div>

              {/* Footer */}
              <div className="relative px-6 mt-auto mb-6 space-y-2">
                <p className="text-[10px] text-white/30 leading-relaxed">
                  Virtual card issued via Airwallex (sandbox). Not a real
                  financial instrument.
                </p>
                <div className="flex items-center justify-between">
                  <Image
                    src="/meridian-logo.svg"
                    alt="Meridian"
                    width={20}
                    height={20}
                    className="opacity-40"
                  />
                  <div className="flex gap-0.5">
                    <div className="w-4 h-4 rounded-full bg-neon/40" />
                    <div className="w-4 h-4 rounded-full bg-electric/30 -ml-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tap hint */}
      <p className="text-center text-xs text-muted-text mt-3">
        Tap card to flip
      </p>

      {/* Copy actions */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Number", value: cardNumber },
          { label: "Expiry", value: expiry },
          { label: "CVV", value: cvv },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => handleCopy(value, label)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface border border-white/5 hover:border-neon/20 transition-colors text-xs cursor-pointer"
          >
            {copied === label ? (
              <Check className="w-3 h-3 text-neon" />
            ) : (
              <Copy className="w-3 h-3 text-muted-text" />
            )}
            <span className={copied === label ? "text-neon" : "text-white/60"}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
