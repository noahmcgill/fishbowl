import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ClaimLinkForm() {
  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Your Project&apos;s Name</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-zinc-800">
              transparifi.org/
            </span>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="your-company"
              className="pl-28"
            />
          </div>
        </div>
        <Button>Claim your link</Button>
      </div>
    </form>
  );
}
