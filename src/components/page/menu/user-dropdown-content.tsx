"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LuLogOut, LuNetwork } from "react-icons/lu";

export const UserDropdownContent = () => {
  return (
    <DropdownMenuContent
      side="top"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem className="cursor-pointer rounded-lg p-3 text-xs text-zinc-500">
          <LuNetwork />
          API Key
        </DropdownMenuItem>
      </DialogTrigger>
      <DropdownMenuItem
        onClick={async () => await signOut()}
        className="cursor-pointer rounded-lg p-3 text-xs text-zinc-500"
      >
        <LuLogOut />
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
