"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Hobby",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for personal projects and experimentation.",
    features: [
      "Up to 5 active workflows",
      "1,000 executions / month",
      "Standard support",
      "Basic AI models",
    ],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: 29, yearly: 240 },
    description: "For scaling startups and professional automation.",
    features: [
      "Unlimited active workflows",
      "50,000 executions / month",
      "Priority email support",
      "Advanced AI integration",
      "Custom triggers",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 99, yearly: 950 },
    description: "Advanced controls and security for large teams.",
    features: [
      "Million+ executions / month",
      "Dedicated account manager",
      "SSO & advanced security",
      "SLA guarantees",
      "Custom node development",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="mt-32 w-full max-w-7xl px-4 relative">
      {/* "Free for limited time" Banner */}
      <div className="mb-12 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 backdrop-blur-md shadow-2xl animate-pulse">
          <Icon icon="lucide:sparkles" className="size-4 text-indigo-400" />
          <span className="text-sm font-semibold text-neutral-800 dark:text-white">
            Early Access: Hooks is free for a limited time during development phase
          </span>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-800 dark:text-white mb-6">
          Simple, Transparent Pricing
        </h2>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-sm font-medium", !isYearly ? "text-white" : "text-neutral-500")}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 bg-neutral-800 rounded-full p-1 transition-colors hover:bg-neutral-700"
          >
            <motion.div
              animate={{ x: isYearly ? 28 : 0 }}
              className="w-5 h-5 bg-white rounded-full shadow-lg"
            />
          </button>
          <span className={cn("text-sm font-medium", isYearly ? "text-white" : "text-neutral-500")}>
            Yearly <span className="text-emerald-500 ml-1 text-[10px] uppercase font-bold tracking-widest">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative flex flex-col p-8 rounded-[2.5rem] border backdrop-blur-sm transition-all duration-300",
              plan.highlight 
                ? "bg-white/10 border-indigo-500/50 shadow-[0_0_40px_rgba(79,70,229,0.2)] scale-105 z-10" 
                : "bg-neutral-900/50 border-white/10 hover:border-white/20"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-[10px] font-bold text-white uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{plan.description}</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">
                ${isYearly ? plan.price.yearly : plan.price.monthly}
              </span>
              <span className="text-neutral-500 text-sm">/{isYearly ? 'year' : 'month'}</span>
            </div>

            <ul className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-neutral-300">
                  <Icon icon="lucide:check" className="size-4 text-emerald-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={cn(
              "w-full py-4 rounded-2xl font-semibold transition-all duration-300 active:scale-95",
              plan.highlight
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            )}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
