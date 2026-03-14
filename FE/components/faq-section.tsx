"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is Hooks really open source?",
    answer: "Yes! The core engine, visual builder, and all official node integrations are fully open source under the MIT license. You can find our code on GitHub, self-host it, or contribute to its development.",
  },
  {
    question: "What AI models are supported?",
    answer: "We support industry-leading models including OpenAI's GPT-4o, Anthropic's Claude 3.5 Sonnet, and Google's Gemini Pro. Our flexible architecture allows you to plug in any LLM with an API.",
  },
  {
    question: "How do I self-host Hooks?",
    answer: "You can deploy Hooks using Docker. We provide a comprehensive guide in our documentation specifically for self-hosting on your own infrastructure for maximum privacy and control.",
  },
  {
    question: "Can I create custom nodes?",
    answer: "Absolutely. Hooks is designed for developers. You can write custom logic in TypeScript or JavaScript and integrate it as a reusable node within your workflows.",
  },
  {
    question: "What's the 'limited time' for free access?",
    answer: "As we are currently in our public development phase, all advanced features are available for free. Once we transition to our stable 1.0 release, we will introduce our paid tiers, but early supporters will always have a generous free tier.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-40 w-full max-w-4xl px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-800 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about Hooks and our open-source mission.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/10"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-6 flex items-center justify-between text-left group"
            >
              <span className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {faq.question}
              </span>
              <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                <Icon icon="lucide:chevron-down" className="size-5 text-neutral-500" />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
