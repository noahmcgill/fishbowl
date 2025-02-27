import { Button } from "../ui/button";
import { LuLoader } from "react-icons/lu";
import { continueWithMagicLink } from "@/lib/utils/actions";
import { useActionState } from "react";

export const ContinueWithMagicLinkBtn = () => {
  const [, action, pending] = useActionState<void, FormData>(
    async (prevState, formData) => {
      await continueWithMagicLink(formData);
      return prevState;
    },
    undefined,
  );

  return (
    <Button
      type="submit"
      className="w-full"
      formAction={action}
      disabled={pending}
    >
      {pending && <LuLoader className="animate-spin" />}
      Login
    </Button>
  );
};
