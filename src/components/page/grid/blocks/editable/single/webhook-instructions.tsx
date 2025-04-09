import { Button } from "@/components/ui/button";

interface WebhookInstructionsProps {
  blockKey: string;
  onClose: () => void;
}

export const WebhookInstructions: React.FC<WebhookInstructionsProps> = ({
  blockKey,
  onClose,
}) => {
  return (
    <div className="mx-auto flex max-w-xl flex-col space-y-4">
      <p>
        You can populate the data in this block by calling the following{" "}
        <span className="bg-zinc-200 p-1">POST</span> endpoint:
      </p>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
        /api/webhooks/single/{blockKey}
      </pre>
      <p>
        The request body should contain a JSON object with a data field
        containing a string-formatted representation of the data to be added
        (type:{" "}
        <span className="bg-zinc-200 p-1">&#123; data: string &#125;</span>).
      </p>
      <p className="font-medium">Example</p>
      <p>
        Consider the following curl request (note: don&apos;t forget your API
        key!):
      </p>
      <pre className="w-full whitespace-pre-wrap break-all rounded-md bg-muted p-4 text-sm">
        curl -XPOST -H &apos;Authorization: Bearer <b>&lt;apiKey&gt;&apos;</b> \{" "}
        <br />
        {"  "}-H &quot;Content-type: application/json&quot; \ <br />
        {"  "}-d &apos;
        {JSON.stringify({ data: "1280" })}
        &apos; \ <br />
        {"  "}&apos;https://fishbowl.fyi/api/webhooks/single/{blockKey}&apos;
      </pre>
      <p>
        If you want to mutate already-existing data, first call the same
        endpoint URL but with a <span className="bg-zinc-200 p-1">GET</span>{" "}
        method, mutate the data, and send it back via the{" "}
        <span className="bg-zinc-200 p-1">POST</span> method
      </p>
      <div className="flex w-full justify-end">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
};
