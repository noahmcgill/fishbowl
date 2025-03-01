"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { ClaimLinkStatusIcon } from "./claim-link-status-icon";

export function ClaimLinkForm() {
  const [input, setInput] = useState<string>("");
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);

  const [slug, isDebouncing] = useDebounce(input, 500);

  const { data, isLoading } = api.page.slugExists.useQuery(
    { slug },
    {
      enabled: slug !== "" && inputHasChanged,
      retry: false,
      refetchOnMount: false,
      staleTime: 0,
    },
  );

  useEffect(() => {
    if (input !== "") {
      setInputHasChanged(true);
    }
  }, [input]);

  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label className="text-2xl" htmlFor="name">
              Your project&apos;s stats, stat.
            </Label>
            <p className="text-sm">
              Create a dashboard to share metrics publicly.
            </p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-zinc-800">
              transparifi.org/
            </span>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="your-company"
              className="pl-28"
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
        {/*eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing*/}
        <Button disabled={data || isDebouncing || isLoading || input === ""}>
          Claim your link
        </Button>
      </div>
    </form>
  );
}
