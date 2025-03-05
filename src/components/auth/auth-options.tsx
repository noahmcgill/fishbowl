import { Button } from "../ui/button";
import Link from "next/link";
import { ClaimLinkStep } from "../ui/claim-link/types";

interface AuthOptionsProps {
  signup: boolean;
  setCurrentStep?: (step: ClaimLinkStep) => void;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({
  signup,
  setCurrentStep,
}) => {
  return (
    <p className="text-center text-sm text-zinc-500">
      {signup && (
        <Button
          variant="link"
          className="self-start p-0 font-normal text-zinc-500"
          onClick={() => setCurrentStep?.(ClaimLinkStep.CHECK_LINK)}
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
