import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { ApiKeyField } from "./api-key-field";

export const ApiKeyDialogContent = () => {
  const {
    data,
    error: getError,
    isLoading,
  } = api.user.userApiKeyExists.useQuery(undefined, {
    refetchOnMount: false,
    staleTime: 0,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-medium">Your API Key</DialogTitle>
        <DialogDescription>
          Here, you can view or refresh your fishbowl API key. The key can be
          used for programmatically updating widget data.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <ApiKeyField apiKeyExists={data ?? false} />
        )}
        {getError && (
          <div className="pt-2 text-sm text-red-500">
            We&apos;re sorry, an unexpected error occurred. Please try again.
          </div>
        )}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
