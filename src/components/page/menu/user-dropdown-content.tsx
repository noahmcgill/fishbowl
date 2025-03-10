"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export const UserDropdownContent = () => {
  return (
    <DropdownMenuContent
      side="top"
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem className="cursor-pointer justify-center rounded-lg p-3 text-xs text-zinc-500">
          API Key
        </DropdownMenuItem>
      </DialogTrigger>
      <DropdownMenuItem
        onClick={async () => await signOut()}
        className="cursor-pointer justify-center rounded-lg p-3 text-xs text-zinc-500"
      >
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
