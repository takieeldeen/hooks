"use client";
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
} from "./ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { logout } from "@/api/auth";
import { toast } from "sonner";
import SubscribeButton from "../features/payments/SubscribeButton";

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

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.refresh();
    } catch (error: any) {
      toast.error(`Failed to Sign Out: ${error.message}`);
    }
  }, [router]);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuSubItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/workflows" prefetch>
              <Image src="/logo/logo.svg" height={36} width={36} alt="Nodes" />
              <span className="font-semibold text-sm">Nodes</span>
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
