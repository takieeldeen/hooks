"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icon } from "@iconify/react";

const apps = [
  "logos:google-drive",
  "logos:slack-icon",
  "logos:discord-icon",
  "logos:stripe",
  "logos:whatsapp-icon",
  "logos:github-icon",
  "simple-icons:gmail",
  "logos:trello",
  "logos:notion-icon",
  "logos:zoom-icon",
  "logos:salesforce",
  "logos:hubspot",
  "logos:shopify",
  "logos:mailchimp-icon",
  "logos:asana-icon",
  "logos:atlassian",
];

export default function ConnectedAppsBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:layers" className="text-blue-400" />
          100+ Connectors
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Everything from CRMs to databases, ready to be linked in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative p-6 pt-0">
        <div className="grid grid-cols-4 gap-4">
          {apps.map((app, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-110"
            >
              <Icon
                icon={app}
                className="size-6 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-neutral-950/80 to-transparent flex items-end justify-center pb-4">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
            View All Integrations
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
