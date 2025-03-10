"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuSettings2 } from "react-icons/lu";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { UserDropdownTooltip } from "./user-dropdown-tooltip";
import { UserDropdownContent } from "./user-dropdown-content";
import { ApiKeyDialogContent } from "./api-key-dialog-content";
import { useState } from "react";

export const UserDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <UserDropdownTooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <LuSettings2 className="text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <UserDropdownContent />
        </DropdownMenu>
      </UserDropdownTooltip>
      {open && <ApiKeyDialogContent />}
    </Dialog>
  );
};
