import { getCheckoutLink, useGetMySubscription } from "@/api/subscription";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { StarIcon } from "lucide-react";
import React, { useCallback } from "react";

function SubscribeButton() {
  const { data, isLoading } = useGetMySubscription();
  const handleCheckout = useCallback(async () => {
    const link = await getCheckoutLink();
    window.location.href = link;
  }, []);
  if (isLoading || data?.isSubscribed) return null;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip="Upgrade to Pro"
        className="gap-x-4 h-10 px-4"
        onClick={handleCheckout}
      >
        <StarIcon className="h-4 w-4" />
        <span>Upgrade to Pro</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default SubscribeButton;
