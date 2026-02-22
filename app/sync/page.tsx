"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { COMPANY_NAME } from "@/lib/mockSession";

type Provider = {
  id: string;
  name: string;
  logo: string;
  color: string;
};

const providers: Provider[] = [
  { id: "adp", name: "ADP", logo: "ADP", color: "#FF0000" },
  { id: "workday", name: "Workday", logo: "W", color: "#0875E1" },
  { id: "gusto", name: "Gusto", logo: "G", color: "#F45D48" },
];

export default function SyncPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"pick" | "connecting" | "done">("pick");

  const handleSelect = (id: string) => {
    if (id !== "adp") return; // only ADP is wired up
    setSelected(id);
    setPhase("connecting");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => router.push("/salary-story"), 800);
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-text hover:text-white gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-surface border border-electric/20">
            <Link2 className="w-4 h-4 text-electric" />
            <span className="text-xs text-electric font-medium">
              Payroll Sync
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Connect Your Payroll
          </h1>
          <p className="text-muted-text">
            {COMPANY_NAME} uses one of these providers. Select yours to pull
            your paycheck data.
          </p>
        </motion.div>

        {/* Provider cards */}
        <AnimatePresence mode="wait">
          {phase === "pick" && (
            <motion.div
              key="pick"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {providers.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full rounded-2xl bg-surface border p-5 flex items-center gap-4 transition-all cursor-pointer ${
                    p.id === "adp"
                      ? "border-white/10 hover:border-electric/40 hover:shadow-[0_0_20px_rgba(125,249,255,0.1)]"
                      : "border-white/5 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {/* Logo placeholder */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                    style={{
                      background: `${p.color}15`,
                      border: `1px solid ${p.color}30`,
                      color: p.color,
                      boxShadow: `0 0 20px ${p.color}10`,
                    }}
                  >
                    {p.logo}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-muted-text">
                      {p.id === "adp"
                        ? "Detected — tap to connect"
                        : "Not available for demo"}
                    </div>
                  </div>
                  {p.id === "adp" && (
                    <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {(phase === "connecting" || phase === "done") && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 py-16"
            >
              {/* ADP logo glow */}
              <motion.div
                animate={{
                  boxShadow:
                    phase === "connecting"
                      ? [
                          "0 0 20px rgba(255,0,0,0.2)",
                          "0 0 40px rgba(255,0,0,0.4)",
                          "0 0 20px rgba(255,0,0,0.2)",
                        ]
                      : "0 0 30px rgba(57,255,20,0.3)",
                }}
                transition={
                  phase === "connecting"
                    ? { duration: 1.5, repeat: Infinity }
                    : { duration: 0.4 }
                }
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl"
                style={{
                  background:
                    phase === "done" ? "rgba(57,255,20,0.1)" : "#FF000015",
                  border:
                    phase === "done"
                      ? "1px solid rgba(57,255,20,0.3)"
                      : "1px solid #FF000030",
                  color: phase === "done" ? "#39FF14" : "#FF0000",
                }}
              >
                {phase === "done" ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  "ADP"
                )}
              </motion.div>

              <div className="text-center space-y-2">
                {phase === "connecting" ? (
                  <>
                    <div className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 text-electric animate-spin" />
                      <span className="text-electric font-medium">
                        Authenticating with Employer...
                      </span>
                    </div>
                    <p className="text-xs text-muted-text">
                      Securely connecting to {COMPANY_NAME}&apos;s ADP instance
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-neon font-semibold">
                      Payroll synced successfully!
                    </span>
                    <p className="text-xs text-muted-text">
                      Redirecting to your salary story...
                    </p>
                  </>
                )}
              </div>

              {/* Progress bar */}
              {phase === "connecting" && (
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-electric/60 to-electric rounded-full"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
