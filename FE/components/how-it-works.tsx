"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Connect",
    description: "Link your favorite apps like Discord, Slack, and Google Forms with one click.",
    icon: "lucide:link-2",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Orchestrate",
    description: "Design logic and AI automation steps in our visual, no-code workflow builder.",
    icon: "lucide:git-pull-request",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Deploy",
    description: "Run your workflow forever. We handle the scheduling, retries, and infrastructure.",
    icon: "lucide:rocket",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-32 w-full max-w-6xl px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-800 dark:text-white mb-4">
          How Hooks Works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From connection to production in minutes. No infrastructure management required.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Connection Lines (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-linear-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent z-0" />

        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <div className={`p-6 rounded-3xl ${step.bgColor} border border-white/5 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] mb-6`}>
              <Icon icon={step.icon} className={`size-12 ${step.color}`} />
            </div>
            
            <div className="absolute -top-4 -right-4 size-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-sm font-bold text-neutral-400">
              {index + 1}
            </div>

            <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">
              {step.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
