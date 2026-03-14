"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function CustomizableWorkflowBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl h-96">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-br from-pink-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated nodes visual */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <motion.path
            d="M 100 200 Q 200 100 300 200 T 500 200"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:wand2" className="text-pink-400" />
          Customizable Workflow
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Build any workflow in your imagination without limitations.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative h-56 flex flex-col items-center justify-center -mt-4 overflow-hidden">
        {/* Visual representation of nodes being built */}
        <div className="relative w-full max-w-[280px] h-32">
          {/* Main Node */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl">
              <Icon icon="lucide:puzzle" className="size-8 text-pink-400" />
            </div>
          </motion.div>

          {/* Connected orbiting nodes */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                rotate: 360,
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                style={{
                  left: `${50 + Math.cos((i * 90 * Math.PI) / 180) * 35}%`,
                  top: `${50 + Math.sin((i * 90 * Math.PI) / 180) * 35}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <Icon 
                  icon={
                    i === 0 ? "lucide:mail" : 
                    i === 1 ? "lucide:database" : 
                    i === 2 ? "lucide:message-square" : 
                    "lucide:globe"
                  } 
                  className="size-4 text-orange-400" 
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Connection Lines (Static placeholders for vibe) */}
          <div className="absolute inset-0 flex items-center justify-center py-10 opacity-10">
            <div className="w-full h-px bg-white/20 rotate-45" />
            <div className="w-full h-px bg-white/20 -rotate-45" />
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <span className="px-2 py-1 rounded-md bg-pink-500/10 border border-pink-500/20 text-[10px] text-pink-400 font-medium uppercase tracking-tighter">
            Unlimited Nodes
          </span>
          <span className="px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-medium uppercase tracking-tighter">
            Conditional Logic
          </span>
        </div>
      </CardContent>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">
          No Limits Implementation
        </span>
      </div>
    </Card>
  );
}
