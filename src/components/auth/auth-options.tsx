"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { ClaimLinkStep } from "../ui/claim-link/types";
import { useRouter } from "next/navigation";

interface AuthOptionsProps {
  signup: boolean;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({ signup }) => {
  const router = useRouter();

  return (
    <p className="text-center text-sm text-zinc-500">
      {signup && (
        <Button
          variant="link"
          className="self-start p-0 font-normal text-zinc-500"
          onClick={() => router.push("/claim")}
        >
          go back
        </Button>
      )}
      {" or "}
      <Button asChild variant="link" className="p-0 font-normal text-zinc-500">
        {!signup ? (
          <Link href="/signup">sign up</Link>
        ) : (
          <Link href="/login">login</Link>
        )}
      </Button>
    </p>
  );
};
