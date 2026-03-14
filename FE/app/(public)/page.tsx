import { Metadata } from "next";
import { Marquee } from "@/components/ui/marquee";
import { Icon } from "@iconify/react";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import RealtimeBentoCard from "@/components/bento-cards/realtime-bento-card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hooks",
  description: "SASS for workflow management",
};

const availableServices = [
  {
    label: "Discord",
    icon: "ic:baseline-discord",
  },
  {
    label: "Slack",
    icon: "mdi:slack",
  },
  {
    label: "Google Forms",
    icon: "simple-icons:googleforms",
  },
  {
    label: "Gemini",
    icon: "ri:gemini-fill",
  },
  {
    label: "OpenAi",
    icon: "mingcute:openai-fill",
  },
  {
    label: "Anthropic",
    icon: "simple-icons:claude",
  },
];

import AIModelsBentoCard from "@/components/bento-cards/ai-models-bento-card";
import CredentialsBentoCard from "@/components/bento-cards/credentials-bento-card";
import LogsBentoCard from "@/components/bento-cards/logs-bento-card";
import CustomizableWorkflowBentoCard from "@/components/bento-cards/customizable-workflow-bento-card";
import MultiTriggerBentoCard from "@/components/bento-cards/multi-trigger-bento-card";
import HowItWorks from "@/components/how-it-works";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 text-center py-36">
      <div className="max-w-3xl">
        <h1 className="z-10 text-center text-4xl font-medium tracking-tighter whitespace-pre-wrap text-neutral-800 dark:text-white md:text-6xl lg:text-7xl">
          Build it once <br />
          Run it
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mx-5">
            Forever
          </span>
        </h1>

        <p className="mt-6 text-xl text-muted-foreground">
          A SaaS workflow engine for building and running automations. Connect
          triggers, third‑party APIs, and AI models in a visual editor, then
          deploy the resulting process to any channel or service. It handles
          event scheduling, retries, and service integrations so you never have
          to build infrastructure again.
        </p>
        <Link className="mt-10 mb-8 block" href="/register">
          <RippleButton className="bg-indigo-700 rounded-3xl h-12 text-white text-sm min-w-36 border border-indigo-500 hover:bg-indigo-800">
            <RippleButtonRipples />
            <span>Create your first workflow</span>
          </RippleButton>
        </Link>
        <span className="text-gray-400 text-sm">
          Supports Ton of popular applications
        </span>
        <Marquee pauseOnHover className="[--duration:30s] my-12">
          {availableServices.map((service) => (
            <div
              className="flex items-center justify-center gap-3 mx-4"
              key={service.label}
            >
              <Icon icon={service.icon} className="size-12 text-neutral-400" />
              <span className="text-neutral-400 text-lg font-semibold">
                {service.label}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <RealtimeBentoCard />
        <MultiTriggerBentoCard />
        <CredentialsBentoCard />
        <AIModelsBentoCard />
        <LogsBentoCard />
        <CustomizableWorkflowBentoCard />
      </div>

      <section className="mt-32 max-w-4xl w-full">
        <div className="relative p-12 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 backdrop-blur-sm shadow-xl">
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 via-transparent to-purple-500/10" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-lg mb-6">
              <Icon
                icon="mdi:github"
                className="size-10 text-neutral-800 dark:text-white"
              />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-800 dark:text-white mb-4">
              Open Source from Day One
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              We believe in the power of community. Hooks is fully open source,
              allowing you to self-host, contribute, and verify the code that
              runs your most critical automations.
            </p>

            <Link
              href="https://github.com/takieeldeen/hooks"
              target="_blank"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <span>View on GitHub</span>
              <Icon
                icon="lucide:arrow-right"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="mt-10 flex gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-check" className="size-5" />
                <span className="text-sm font-medium">MIT Licensed</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:users" className="size-5" />
                <span className="text-sm font-medium">Community Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:server" className="size-5" />
                <span className="text-sm font-medium">Self-Hostable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}

export default LandingPage;
