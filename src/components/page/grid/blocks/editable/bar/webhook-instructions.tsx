import Image from "next/image";

interface WebhookInstructionsProps {
  blockKey: string;
}

export const WebhookInstructions: React.FC<WebhookInstructionsProps> = ({
  blockKey,
}) => {
  return (
    <div className="mx-auto flex max-w-xl flex-col space-y-4">
      <p>
        You can populate this bar chart data by calling the following{" "}
        <span className="bg-zinc-200 p-1">POST</span> endpoint:
      </p>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
        /api/webhooks/bar/{blockKey}
      </pre>
      <p>
        The request body should contain a JSON object (type:{" "}
        <span className="bg-zinc-200 p-1">string[][]</span>), representing a CSV
        structure. Each item in the outer array represents a row of data, with
        the first row (CSV headers) being interpreted as your data&apos;s series
        labels.{" "}
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
        {JSON.stringify([
          ["Category", "Series 1", "Series 2", "Series 3"],
          ["January", "30", "45", "60 "],
          ["February", "35", "50", "65 "],
          ["March", "40", "55", "70 "],
          ["April", "50", "60", "80"],
        ])}
        &apos; \ <br />
        {"  "}&apos;https://fishbowl.fyi/api/webhooks/bar/{blockKey}&apos;
      </pre>
      <p>This would result in a bar chart looking something like this:</p>
      <Image
        src="/bar-chart-example.png"
        alt="bar chart example"
        width={500}
        height={500}
      />
      <p>
        If you want to mutate already-existing data, first call the same
        endpoint URL but with a <span className="bg-zinc-200 p-1">GET</span>{" "}
        method, mutate the data, and send it back via the{" "}
        <span className="bg-zinc-200 p-1">POST</span> method
      </p>
    </div>
  );
};
