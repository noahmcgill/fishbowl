import { useFormStatus } from "react-dom";
import { Button } from "../button";
import { LuLoader } from "react-icons/lu";

interface ClaimLinkBtnProps {
  data?: boolean;
  isDebouncing: boolean;
  isLoading: boolean;
  input: string;
}

export const ClaimLinkBtn: React.FC<ClaimLinkBtnProps> = ({
  data,
  isDebouncing,
  isLoading,
  input,
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={data || isDebouncing || isLoading || input === "" || pending}
      type="submit"
    >
      {pending && <LuLoader className="animate-spin" />}
      Claim your link
    </Button>
  );
};
