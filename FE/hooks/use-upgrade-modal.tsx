import UpgradeModal from "@/components/UpgradeModal";
import { useState } from "react";

export const useUpgradeModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleError = (error: any) => {
    if (error) {
      setOpen(true);
      return true;
    }
    return false;
  };

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return { modal, handleError };
};
