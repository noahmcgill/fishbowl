import { Button } from "../ui/button";
import { continueWithGithub } from "@/lib/utils/actions";
import { useActionState } from "react";
import { FaGithub } from "react-icons/fa";

interface ContinueWithGithubBtnProps {
  handleSubmit: (
    action: (formData: FormData) => Promise<void>,
    formData: FormData,
  ) => Promise<void>;
}

export const ContinueWithGithubBtn: React.FC<ContinueWithGithubBtnProps> = ({
  handleSubmit,
}) => {
  const [, action, pending] = useActionState<void, FormData>(
    async (prevState, formData) => {
      await handleSubmit(continueWithGithub, formData);
      return prevState;
    },
    undefined,
  );

  return (
    <Button
      variant="outline"
      className="w-full"
      formAction={action}
      disabled={pending}
    >
      <FaGithub />
      Continue with GitHub
    </Button>
  );
};
