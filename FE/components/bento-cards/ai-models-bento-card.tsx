"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const AISupport = [
  {
    name: "Gemini",
    icon: "ri:gemini-fill",
    color: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/20",
    description: "Google's most capable model",
    delay: 0,
  },
  {
    name: "OpenAI",
    icon: "mingcute:openai-fill",
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    description: "Industry leading GPT-4o integration",
    delay: 0.1,
  },
  {
    name: "Anthropic",
    icon: "simple-icons:claude",
    color: "from-orange-400 to-rose-500",
    shadow: "shadow-orange-500/20",
    description: "Claude 3.5 Sonnet support",
    delay: 0.2,
  },
];

export default function AIModelsBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl h-96">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Mesh-like background */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:brain-circuit" className="text-indigo-400" />
          AI Orchestration
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Harness the power of world-class AI models within your automated workflows.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative h-56 flex items-center justify-center -mt-4">
        <div className="grid grid-cols-3 gap-4 w-full px-4">
          {AISupport.map((ai) => (
            <motion.div
              key={ai.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: ai.delay, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={cn(
                "relative group/ai flex flex-col items-center gap-3 p-4 rounded-2xl",
                "bg-white/5 border border-white/10 backdrop-blur-md",
                "hover:border-white/20 hover:bg-white/10 transition-all duration-300",
                "cursor-default",
                ai.shadow
              )}
            >
              {/* Icon Container */}
              <div className={cn(
                "p-3 rounded-xl bg-linear-to-br transition-transform duration-300 group-hover/ai:scale-110",
                ai.color
              )}>
                <Icon icon={ai.icon} className="size-6 text-white" />
              </div>

              {/* Text Info */}
              <div className="text-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  {ai.name}
                </h4>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  {ai.description}
                </p>
              </div>

              {/* Continuous Connection Line (Visual) */}
              <div className="absolute -bottom-2 w-1 h-1 bg-white/20 rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* Floating background elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-full h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent scale-150" />
        </div>
      </CardContent>
      
      {/* Bottom Label */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-[0.2em]">
          Multi-Provider Integration
        </span>
      </div>
    </Card>
  );
}
