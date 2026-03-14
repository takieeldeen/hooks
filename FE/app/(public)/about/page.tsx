"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-linear-to-r from-white via-white to-neutral-500 bg-clip-text text-transparent">
              Our Mission: <br />
              Democratizing Automation
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Hooks was born from a simple idea: automation should be powerful, open, and accessible to every developer on the planet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-4 border-t border-white/5 bg-neutral-900/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight">The Problem</h2>
            <p className="text-neutral-400 leading-relaxed text-lg">
              Today's automation tools are often "black boxes"—proprietary systems that lock your data and logic behind expensive subscriptions and walled gardens. Developers are forced to choose between ease of use and total control.
            </p>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-sm italic text-neutral-300">
                "We believe you shouldn't have to compromise. You deserve the best tools, without the strings attached."
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight">The Solution</h2>
            <p className="text-neutral-400 leading-relaxed text-lg">
              Hooks is an open-source, AI-first workflow engine. We provide a beautiful visual interface for complex orchestration, while remaining fully transparent and self-hostable. By integrating world-class AI models natively, we're building the infrastructure for the next generation of intelligent applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built on Core Values</h2>
            <p className="text-neutral-500">The principles that guide every line of code we write.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Open Source",
                desc: "Built in public from day one. Our code is your code. Period.",
                icon: "mdi:github",
                color: "text-indigo-400",
              },
              {
                title: "AI-Native",
                desc: "AI isn't an afterthought; it's the core engine of modern automation.",
                icon: "lucide:brain-circuit",
                color: "text-purple-400",
              },
              {
                title: "Privacy First",
                desc: "You own your data. Self-host for total privacy or use our secure cloud.",
                icon: "lucide:shield-check",
                color: "text-emerald-400",
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-neutral-900 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6`}>
                  <Icon icon={value.icon} className={`size-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-[3rem] overflow-hidden bg-linear-to-br from-indigo-600 to-purple-700 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Journey</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                Hooks is more than just a tool—it's a community project. Contribute to the engine, build new nodes, or just give us a star on GitHub.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link 
                  href="https://github.com/takieeldeen/hooks"
                  target="_blank"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Star on GitHub
                </Link>
                <Link 
                  href="/register"
                  className="px-8 py-4 bg-indigo-900/30 text-white border border-white/20 rounded-full font-bold hover:bg-indigo-900/50 transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
