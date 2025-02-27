import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { LuLoader } from "react-icons/lu";
import { continueWithMagicLink } from "@/lib/utils/actions";

export const ContinueWithMagicLinkBtn = () => {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full"
      formAction={continueWithMagicLink}
      disabled={status.pending}
    >
      {status.pending && <LuLoader className="animate-spin" />}
      Login
    </Button>
  );
};
