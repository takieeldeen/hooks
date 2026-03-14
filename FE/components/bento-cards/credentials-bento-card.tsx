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

export default function CredentialsBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl h-96">
      <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:shield-check" className="text-emerald-400" />
          Secure Storage
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Enterprise-grade AES-256 encryption for all your sensitive credentials.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex flex-col items-center justify-center h-48 gap-6">
        {/* Security Shield Visual */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative"
          >
            <Icon icon="lucide:lock" className="size-10 text-emerald-400" />
            
            {/* Rotating Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] border border-dashed border-emerald-500/20 rounded-full"
            />
          </motion.div>
        </div>

        {/* Encrypted Data Strips */}
        <div className="w-full space-y-2 px-4">
          {[
            { label: "API_KEY", dots: 16 },
            { label: "OAUTH_SECRET", dots: 24 },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-neutral-500 font-mono tracking-wider">{item.label}</span>
                <Icon icon="lucide:check-circle-2" className="size-3 text-emerald-500/50" />
              </div>
              <div className="h-8 w-full bg-black/40 rounded-md border border-white/5 flex items-center px-3 overflow-hidden">
                <div className="flex gap-1.5 overflow-hidden">
                  {Array.from({ length: item.dots }).map((_, j) => (
                    <motion.div
                      key={j}
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: j * 0.1,
                        ease: "easeInOut"
                      }}
                      className="size-1.5 rounded-full bg-emerald-500/40 shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
