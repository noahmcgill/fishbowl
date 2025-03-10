import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuSettings2 } from "react-icons/lu";
import { logout } from "@/lib/utils/actions";

export const UserDropdown = () => {
  const handleLogout = async () => {
    "use server";

    await logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <LuSettings2 className="text-zinc-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuItem className="cursor-pointer justify-center rounded-lg p-3 text-xs text-zinc-500">
          API Keys
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer justify-center rounded-lg p-3 text-xs text-zinc-500"
          onClick={handleLogout}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
