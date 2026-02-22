"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";

const MOCK_CONVERSATION = [
  {
    role: "user" as const,
    text: "Can I afford to move to a $1,800/mo apartment?",
  },
  {
    role: "ai" as const,
    text: "Based on your synced ADP payroll and your investing goals, an $1,800 rent leaves you with tight margins for Guilt-Free Spending. I recommend staying under $1,500 to keep your budget balanced.",
  },
];

export default function AICopilot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(MOCK_CONVERSATION);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    // Simulate AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I'd need to analyze your full budget to give a precise answer. Based on your current allocations, I'd suggest reviewing your Essentials category in the Budget Blueprint.",
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-surface border border-electric/30 flex items-center justify-center cursor-pointer hover:border-electric/60 transition-colors"
            style={{
              boxShadow:
                "0 0 20px rgba(125,249,255,0.15), 0 0 40px rgba(125,249,255,0.05)",
            }}
          >
            <Sparkles className="w-6 h-6 text-electric" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[480px] rounded-2xl bg-surface border border-electric/20 flex flex-col overflow-hidden"
            style={{
              boxShadow:
                "0 0 30px rgba(125,249,255,0.1), 0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-electric" />
                <span className="text-sm font-semibold text-white">
                  AI Co-Pilot
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-muted-text" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-electric/15 text-white rounded-br-sm"
                        : "bg-white/5 text-white/80 rounded-bl-sm border border-white/5"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your finances..."
                  className="flex-1 bg-background border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-muted-text focus:outline-none focus:border-electric/40 transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="w-9 h-9 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center hover:bg-electric/20 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-electric" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
