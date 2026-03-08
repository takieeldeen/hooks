import { Metadata } from "next";
import { Marquee } from "@/components/ui/marquee";
import { Icon } from "@iconify/react";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import RealtimeBentoCard from "@/components/bento-cards/realtime-bento-card";

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
        <div className="mt-10 mb-30">
          <RippleButton className="bg-indigo-700 rounded-3xl h-12 text-white text-sm min-w-36 border border-indigo-500 hover:bg-indigo-800">
            <RippleButtonRipples />
            <span>Create your workflow</span>
          </RippleButton>
        </div>
        {/* <marquee
          className="mt-12 text-sm text-muted-foreground"
          scrollamount="5"
        >
          Discord · Slack · Google Forms · Gemini · OpenAI · Anthropic
        </marquee> */}
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
      <div className="max-w-7xl w-full grid grid-cols-3">
        <RealtimeBentoCard />
      </div>
    </main>
  );
}

export default LandingPage;
