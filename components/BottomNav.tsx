"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BarChart3, Heart, CreditCard } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/salary-story", icon: BarChart3, label: "Pay" },
  { href: "/benefits", icon: Heart, label: "Benefits" },
  { href: "/card", icon: CreditCard, label: "Card" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Frosted glass backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/5" />

      <div className="relative max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-colors relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-neon/8 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? "text-neon" : "text-muted-text"
                }`}
              />
              <span
                className={`text-[10px] relative z-10 transition-colors ${
                  isActive
                    ? "text-neon font-medium"
                    : "text-muted-text"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
