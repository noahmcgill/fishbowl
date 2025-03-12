import { ScrollArea } from "@/components/ui/scroll-area";
import { type SingleDataPointConfig } from "@/store/types";

interface SingleDataPointBlockProps {
  config: SingleDataPointConfig;
}

export const SingleDataPointBlock: React.FC<SingleDataPointBlockProps> = ({
  config,
}) => {
  return (
    <div className="flex h-full w-full cursor-grab flex-col justify-center gap-2 rounded-3xl border-[1px] border-slate-200 p-8 shadow-[0_2px_4px_rgba(0,0,0,.04)] active:cursor-grabbing active:bg-white">
      <div className="text-sm font-medium text-zinc-700">{config.title}</div>
      <ScrollArea className="w-full">
        <div className="whitespace-nowrap text-4xl font-bold">
          {config.data}
        </div>
      </ScrollArea>
      {config.description && (
        <div className="text-xs font-normal text-zinc-600">
          {config.description}
        </div>
      )}
    </div>
  );
};
