"use client";

import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";

type BabelFishPanelProps = {
  markdown: string;
  isStreaming: boolean;
};

export default function BabelFishPanel({
  markdown,
  isStreaming,
}: BabelFishPanelProps) {
  // Parse markdown sections: split on ### headings
  const sections = markdown
    .split(/^### /m)
    .filter(Boolean)
    .map((section) => {
      const lines = section.split("\n");
      const title = lines[0]?.trim();
      const body = lines.slice(1).join("\n").trim();
      return { title, body };
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquareText className="w-5 h-5 text-electric" />
        <h2 className="text-lg font-semibold">Your Benefits, Explained</h2>
        {isStreaming && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2 text-xs text-electric"
          >
            thinking...
          </motion.div>
        )}
      </div>

      {/* Benefit cards */}
      <div className="grid gap-3">
        {sections.map(({ title, body }, i) => (
          <motion.div
            key={title || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="rounded-xl bg-surface border border-white/5 p-4"
          >
            <h3 className="text-sm font-semibold text-electric mb-2">
              {title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
              {body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Streaming cursor */}
      {isStreaming && sections.length === 0 && (
        <div className="rounded-xl bg-surface border border-white/5 p-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-4 bg-electric rounded-sm"
            />
            <span className="text-sm text-muted-text">
              Analyzing your benefits...
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
