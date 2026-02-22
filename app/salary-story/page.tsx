"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WaterfallChart from "@/components/WaterfallChart";
import BottomNav from "@/components/BottomNav";
import { mockEmployee, EMPLOYEE_NAME, COMPANY_NAME } from "@/lib/mockSession";

export default function SalaryStoryPage() {
  const [waterfallDone, setWaterfallDone] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 pb-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] bg-danger/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-2"
        >
          <Link href="/sync">
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
            Step 2 of 5
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
            Your Salary Story
          </h1>
          <p className="text-muted-text">
            Here&apos;s where {EMPLOYEE_NAME.split(" ")[0]}&apos;s{" "}
            <span className="text-neon font-semibold">
              $85,000
            </span>{" "}
            at {COMPANY_NAME} actually goes.
          </p>
        </motion.div>

        {/* Waterfall */}
        <WaterfallChart
          grossSalary={mockEmployee.grossSalary}
          federalTax={mockEmployee.federalTax}
          stateTax={mockEmployee.stateTax}
          ficaTax={mockEmployee.ficaTax}
          healthPremium={mockEmployee.healthPremium}
          retirement401k={mockEmployee.retirement401k}
          netPay={mockEmployee.netPay}
          onComplete={() => setWaterfallDone(true)}
        />

        {/* CTA to next step */}
        {waterfallDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-4 mt-10"
          >
            <p className="text-sm text-muted-text text-center max-w-md">
              That&apos;s a{" "}
              <span className="text-danger font-semibold">
                {Math.round(
                  ((mockEmployee.grossSalary - mockEmployee.netPay) /
                    mockEmployee.grossSalary) *
                    100
                )}
                %
              </span>{" "}
              gap between what you earn and what you keep. But your benefits
              might not be optimized — let&apos;s check.
            </p>
            <Link href="/benefits">
              <Button
                size="lg"
                className="bg-neon text-background font-semibold text-base px-8 py-6 rounded-2xl hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-all duration-300 cursor-pointer"
              >
                Optimize My Benefits
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
