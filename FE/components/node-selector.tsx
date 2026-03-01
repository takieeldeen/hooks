import { NodeType } from "@/config/node-components";
import { createId } from "@paralleldrive/cuid2";
import { ReactNode, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: ReactNode;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: "MANUAL_TRIGGER",
    label: "Trigger Manually",
    description:
      "Runs the flow on clicking a button, Good for getting started quickly",
    icon: <Icon icon="lucide:mouse-pointer" className="size-6" />,
  },
  {
    type: "GOOGLE_FORM_TRIGGER",
    label: "Trigger on Submission of Google Form",
    description: "Runs the flow on submitting of a specific google form.",
    icon: (
      <Icon
        icon="simple-icons:googleforms"
        className="size-6 text-indigo-700"
      />
    ),
  },
  // {
  //   type: "STRIPE_TRIGGER",
  //   label: "Stripe Action Trigger",
  //   description: "Runs the flow on a certain action in stripe.",
  //   icon: (
  //     <Icon icon="mingcute:stripe-fill" className="size-6 text-indigo-700" />
  //   ),
  // },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: "HTTP_REQUEST",
    label: "HTTP Request",
    description: "Make a HTTP request to an external API",
    icon: <Icon icon="mynaui:globe" className="size-6" />,
  },
  {
    type: "GEMINI",
    label: "Gemini",
    description: "Uses Google Gemini to Generate Text",
    icon: <Icon icon="material-icon-theme:gemini-ai" className="size-6" />,
  },
  {
    type: "OPENAI",
    label: "OpenAI",
    description: "Uses OpenAI to Generate Text",
    icon: <Icon icon="simple-icons:openai" className="size-6" />,
  },
  {
    type: "ANTHROPIC",
    label: "Anthropic",
    description: "Uses Anthropic to Generate Text",
    icon: <Icon icon="simple-icons:anthropic" className="size-6" />,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelection = useCallback(
    (node: NodeTypeOption) => {
      if (node.type === "MANUAL_TRIGGER") {
        const nodes = getNodes();
        const HAS_MANUAL_TRIGGER = nodes.some(
          (node) => node.type === "MANUAL_TRIGGER",
        );
        if (HAS_MANUAL_TRIGGER) {
          return toast.error("Only one manual trigger is allowed per workflow");
        }
      }
      setNodes((nodes) => {
        const HAS_INITIAL_NODE = !!nodes.find(
          (node) => node.type === "INITIAL",
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const position = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          data: {},
          position,
          type: node.type,
        };

        if (HAS_INITIAL_NODE) return [newNode];
        onOpenChange(false);
        return [...nodes, newNode];
      });
    },
    [getNodes, onOpenChange, screenToFlowPosition, setNodes],
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                onClick={() => handleNodeSelection(node)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2
            border-transparent hover:border-l-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {/* {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={node.label}
                      className="size-5 object-bottom rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )} */}
                  {Icon}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {node.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {executionNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                onClick={() => handleNodeSelection(node)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2
            border-transparent hover:border-l-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {/* {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={node.label}
                      className="size-5 object-bottom rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )} */}
                  {Icon}

                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {node.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
