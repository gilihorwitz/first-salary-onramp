"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { COMPANY_NAME, COMPANY_LOGO } from "@/lib/mockSession";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jordan.rivera@meridian.io");
  const [password, setPassword] = useState("••••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => router.push("/sync"), 600);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 w-full max-w-sm z-10"
      >
        {/* Company branding */}
        <div className="flex items-center gap-3">
          <Image
            src={COMPANY_LOGO}
            alt={`${COMPANY_NAME} logo`}
            width={40}
            height={40}
          />
          <span className="text-muted-text text-sm font-medium tracking-wide uppercase">
            {COMPANY_NAME}
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Welcome aboard.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-muted-text"
          >
            Sign in to decode your first paycheck.
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full space-y-4"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-text uppercase tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-text focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-text uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-text focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-neon text-background font-semibold text-base py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Signing in...
              </motion.span>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-xs text-muted-text/60 text-center max-w-xs"
        >
          This is a demo environment. No real credentials are required.
        </motion.p>
      </motion.div>
    </main>
  );
}
