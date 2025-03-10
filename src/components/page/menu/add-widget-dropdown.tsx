"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuPlus } from "react-icons/lu";

export const AddWidgetDropdown = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="rounded-full">
                <LuPlus />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent
            side="top"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuItem className="cursor-pointer">
              Chart
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Add Widget</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
