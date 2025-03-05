"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { ClaimLinkStatusIcon } from "./claim-link-status-icon";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEffect, useState } from "react";
import { claim } from "@/lib/utils/actions";
import { useFormStatus } from "react-dom";
import { LuLoader } from "react-icons/lu";
import { ClaimLinkBtn } from "./claim-link-btn";

interface ClaimLinkFormProps {
  initialSlug?: string;
}

export const ClaimLinkForm: React.FC<ClaimLinkFormProps> = ({
  initialSlug,
}) => {
  const [input, setInput] = useState<string>(initialSlug ?? "");
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);
  const [slug, isDebouncing] = useDebounce(input, 500);

  useEffect(() => {
    if (input !== "") {
      setInputHasChanged(true);
    }
  }, [input]);

  const { data, isLoading, error } = api.page.slugExists.useQuery(
    { slug },
    {
      enabled: slug !== "" && inputHasChanged,
      retry: false,
      refetchOnMount: false,
      staleTime: 0,
    },
  );

  return (
    <form action={claim}>
      <div className="flex flex-col gap-6 text-center">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label className="text-2xl font-medium" htmlFor="name">
              Your project&apos;s stats, stat.
            </Label>
            <p className="text-sm">
              Create a dashboard to share metrics publicly.
            </p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-zinc-800">
              transparify.org/
            </span>
            <Input
              id="slug"
              type="text"
              name="slug"
              placeholder="your-company"
              className="pl-[114px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-zinc-800">
              <ClaimLinkStatusIcon
                initialized={inputHasChanged}
                disabled={input === ""}
                slugExists={data ?? false}
                isLoading={isLoading || isDebouncing}
              />
            </span>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500">
            An unexpected error occured. Please try again.
          </p>
        )}
        <ClaimLinkBtn
          data={data}
          isDebouncing={isDebouncing}
          isLoading={isLoading}
          input={input}
        />
        <p className="text-center text-sm text-zinc-500">
          or{" "}
          <Button
            asChild
            variant="link"
            className="p-0 font-normal text-zinc-500"
          >
            <Link href="/login">login</Link>
          </Button>
        </p>
      </div>
    </form>
  );
};
