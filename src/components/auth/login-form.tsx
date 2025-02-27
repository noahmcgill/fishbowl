"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <div className={"flex flex-col gap-6"}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-medium">Welcome to Transparifi</h1>
            <div className="text-center text-sm">
              Foster transparency. <br /> Share your startup&apos;s growth with
              the world.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="me@example.com"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              // formAction={continueWithMagicLink}
            >
              Login
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              or
            </span>
          </div>
          <div className="flex">
            <Button
              variant="outline"
              className="w-full"
              // formAction={continueWithGoogle}
            >
              <FaGithub />
              Continue with GitHub
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
