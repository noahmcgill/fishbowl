import { Button } from "../ui/button";
import { LuLoader } from "react-icons/lu";
import { continueWithMagicLink } from "@/lib/utils/actions";
import { useActionState } from "react";

interface ContinueWithMagicLinkBtnProps {
  signup?: boolean;
  handleSubmit: (
    action: (formData: FormData) => Promise<void>,
    formData: FormData,
  ) => Promise<void>;
}

export const ContinueWithMagicLinkBtn: React.FC<
  ContinueWithMagicLinkBtnProps
> = ({ signup, handleSubmit }) => {
  const [, action, pending] = useActionState<void, FormData>(
    async (prevState, formData) => {
      await handleSubmit(continueWithMagicLink, formData);
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
      {signup ? "Sign up" : "Login"}
    </Button>
  );
};
