"use client";

import { FaDoorOpen } from "react-icons/fa";
import { logout } from "@/lib/utils/actions";
import { Button } from "../ui/button";

export const SignoutBtn = () => {
  return (
    <form action={logout}>
      <Button variant="outline" className="w-full" type="submit">
        <FaDoorOpen />
        Sign out
      </Button>
    </form>
  );
};
