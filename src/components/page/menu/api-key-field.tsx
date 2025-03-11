import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import { useState } from "react";
import { LuCheck, LuClipboard } from "react-icons/lu";
import { toast } from "sonner";

interface ApiKeyFieldProps {
  apiKeyExists: boolean;
}

export const ApiKeyField: React.FC<ApiKeyFieldProps> = ({ apiKeyExists }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { mutate, data, isPending } = api.user.refreshUserApiKey.useMutation({
    onError: () => {
      toast.error(
        "We're having trouble generating your API key. Please try again.",
      );
    },
  });

  const handleClipboardCopy = async () => {
    try {
      await navigator.clipboard.writeText(data ?? "");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy API key:", err);
    }
  };

  if (isPending) {
    return <Skeleton className="h-8 w-full" />;
  }

  if (!apiKeyExists && !data) {
    return (
      <div className="flex flex-row items-center gap-1 text-sm text-zinc-500">
        No API key found.{" "}
        <Button
          variant="link"
          className="px-0 font-normal focus-visible:ring-0"
          onClick={() => mutate()}
        >
          Generate key.
        </Button>
      </div>
    );
  }

  if (apiKeyExists && !data) {
    return (
      <div className="flex flex-row items-center gap-1 text-sm text-zinc-500">
        You have an active API key.{" "}
        <Button
          variant="link"
          className="px-0 font-normal focus-visible:ring-0"
          onClick={() => mutate()}
        >
          Refresh key.
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center rounded-md bg-zinc-100 pl-2 text-sm text-zinc-600">
        <ScrollArea className="max-w-96 font-mono">{data}</ScrollArea>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClipboardCopy}
              className="p-0"
              size="icon"
              variant="ghost"
            >
              {isCopied ? <LuCheck size={16} /> : <LuClipboard size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isCopied
              ? "API key copied to clipboard"
              : "Copy API key to clipboard"}
          </TooltipContent>
        </Tooltip>
      </div>
      {data && (
        <p className="text-sm font-medium">
          Important: Be sure to store this key in a secure location! This is the
          last time you&apos;ll be able to view it here. You can&nbsp;
          <Button
            variant="link"
            className="px-0 font-medium underline focus-visible:ring-0"
            onClick={() => mutate()}
          >
            refresh
          </Button>
          &nbsp; it later.
        </p>
      )}
    </div>
  );
};
