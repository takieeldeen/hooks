"use client";
import { cn } from "@/lib/utils";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarToggle,
} from "./ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { logout } from "@/api/auth";
import { toast } from "sonner";
import SubscribeButton from "../features/payments/SubscribeButton";
import { useSidebar } from "./ui/sidebar";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const menuItems = [
  {
    title: "Workflows",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const { resolvedTheme } = useTheme();

  const { logoUrl, logoWidth, logoHeight, buttonHeight } = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    if (state === "collapsed") {
      return {
        logoUrl: isDark ? "/logo/mini-dark.png" : "/logo/mini-light.png",
        logoWidth: 32,
        logoHeight: 32,
        buttonHeight: "h-12",
      };
    }
    // Normal (expanded) state
    return {
      logoUrl: isDark ? "/logo/dark.png" : "/logo/light.png",
      logoWidth: 110,
      logoHeight: 32,
      buttonHeight: "h-16",
    };
  }, [state, resolvedTheme]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.refresh();
    } catch (error: any) {
      toast.error(`Failed to Sign Out: ${error.message}`);
    }
  }, [router]);
  return (
    <Sidebar collapsible="icon" className="relative">
      <SidebarToggle />
      <SidebarHeader>
        <SidebarMenuSubItem>
          <SidebarMenuButton
            asChild
            className={cn("gap-x-4 px-4", buttonHeight)}
          >
            <Link href="/workflows" prefetch>
              <Image
                src={logoUrl}
                height={logoHeight}
                width={logoWidth}
                alt="Nodes"
                className="object-contain"
              />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuSubItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={
                      item.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.url)
                    }
                    asChild
                    className="gap-x-4 h-10 px-4"
                  >
                    <Link
                      href={item.url}
                      prefetch
                      className="flex w-full items-center"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* {!hasActiveSubscription && !isLoading && ( */}
        <SubscribeButton />
        {/* )} */}

        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Billing Portal"
            className="gap-x-4 h-10 px-4"
            onClick={() => {
              //   authClient.customer.portal();
            }}
          >
            <CreditCardIcon className="h-4 w-4" />
            <span>Billing Portal</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Sign Out"
            className="gap-x-4 h-10 px-4"
            onClick={handleSignOut}
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
