import { Button } from "../ui/button";
import Link from "next/link";

interface AuthOptionsProps {
  signup: boolean;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({ signup }) => {
  return (
    <p className="text-center text-sm text-zinc-500">
      {signup && (
        <Button
          variant="link"
          className="self-start p-0 font-normal text-zinc-500"
          asChild
        >
          <Link href="/claim">go back</Link>
        </Button>
      )}
      {" or "}
      <Button asChild variant="link" className="p-0 font-normal text-zinc-500">
        {!signup ? (
          <Link href="/claim">sign up</Link>
        ) : (
          <Link href="/login">login</Link>
        )}
      </Button>
    </p>
  );
};
