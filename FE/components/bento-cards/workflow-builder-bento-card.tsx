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

export default function WorkflowBuilderBentoCard() {
  return (
    <Card className="w-full relative overflow-hidden group border-none bg-neutral-900/50 backdrop-blur-sm shadow-2xl">
      <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="text-left relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Icon icon="lucide:git-branch" className="text-emerald-400" />
          Visual Flow
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Design complex logic with our intuitive drag-and-drop node builder.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-64 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* Node 1 */}
          <div className="absolute left-4 top-1/4 animate-pulse-slow">
            <NodeBox
              icon="logos:slack-icon"
              label="Trigger"
              color="bg-orange-500/20"
              borderColor="border-orange-500/30"
            />
          </div>

          {/* Connection Line 1 */}
          <svg className="absolute w-full h-full pointer-events-none">
            <path
              d="M 120 80 Q 200 80 200 120"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-dash"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Node 2 */}
          <div className="absolute inset-x-0 mx-auto w-fit z-10">
            <NodeBox
              icon="ri:gemini-fill"
              label="Analyze"
              color="bg-blue-500/20"
              borderColor="border-blue-500/30"
            />
          </div>

          {/* Connection Line 2 */}
          <svg className="absolute w-full h-full pointer-events-none">
            <path
              d="M 280 145 Q 350 145 350 200"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-dash"
            />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Node 3 */}
          <div className="absolute right-4 bottom-1/4 animate-pulse-slow delay-700">
            <NodeBox
              icon="logos:discord-icon"
              label="Action"
              color="bg-indigo-500/20"
              borderColor="border-indigo-500/30"
            />
          </div>
        </div>
      </CardContent>
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash {
          animation: dash 3s linear infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}

function NodeBox({
  icon,
  label,
  color,
  borderColor,
}: {
  icon: string;
  label: string;
  color: string;
  borderColor: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 p-3 rounded-xl border backdrop-blur-md shadow-lg transition-transform hover:scale-110",
        color,
        borderColor,
      )}
    >
      <Icon icon={icon} className="size-8" />
      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
