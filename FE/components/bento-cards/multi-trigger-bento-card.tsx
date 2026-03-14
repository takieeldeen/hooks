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

export default function MultiTriggerBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl h-96">
      <div className="absolute inset-0 bg-linear-to-bl from-orange-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:git-merge" className="text-orange-400" />
          Multi-Trigger
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Connect multiple event sources to a single powerful workflow.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex items-center justify-center h-48">
        <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
          {/* Central Workflow Node */}
          <div className="relative z-20 size-16 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center shadow-xl group-hover:border-orange-500/50 transition-colors duration-500">
            <Icon icon="lucide:workflow" className="size-8 text-orange-400" />
            
            {/* Pulsing effect */}
            <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Trigger Nodes */}
          {[
            { icon: "logos:discord-icon", delay: 0, x: -80, y: -60 },
            { icon: "logos:slack-icon", delay: 0.2, x: 80, y: -60 },
            { icon: "logos:google-icon", delay: 0.4, x: -80, y: 60 },
            { icon: "logos:webhooks", delay: 0.6, x: 80, y: 60 },
          ].map((trigger, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.4, scale: 0.8 }}
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.1, 0.8],
                x: [trigger.x, trigger.x * 0.4, trigger.x],
                y: [trigger.y, trigger.y * 0.4, trigger.y],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: trigger.delay,
                ease: "easeInOut"
              }}
              className="absolute z-10 size-10 rounded-lg bg-neutral-800/80 backdrop-blur-md border border-white/5 flex items-center justify-center shadow-lg"
            >
              <Icon icon={trigger.icon} className="size-5" />
              
              {/* Connection Line (SVG) */}
              <svg className="absolute inset-0 size-full overflow-visible pointer-events-none">
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={-trigger.x + 32} // Approximate relative center of workflow node
                  y2={-trigger.y + 32}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="text-orange-500/20"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </motion.div>
          ))}

          {/* Background Decorative Circles */}
          <div className="absolute inset-0 border border-white/5 rounded-full scale-100 opacity-20" />
          <div className="absolute inset-0 border border-white/5 rounded-full scale-75 opacity-20" />
          <div className="absolute inset-0 border border-white/5 rounded-full scale-50 opacity-20" />
        </div>
      </CardContent>
    </Card>
  );
}
