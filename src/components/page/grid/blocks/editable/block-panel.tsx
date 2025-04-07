import { Button } from "@/components/ui/button";
import { BlockSize } from "./types";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import { SingleBlockIcon } from "@/icons/single-block-icon";
import { DoubleBlockIcon } from "@/icons/double-block-icon";

export interface BarChartBlockOption {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface BlockPanelProps {
  handleChange: (size: BlockSize) => Promise<void>;
  handleDelete: () => Promise<void>;
  allowedSizes: BlockSize[]; // Updated here
  currentSize: BlockSize;
  showSizeSelector?: boolean;
}

export const BlockPanel: React.FC<BlockPanelProps> = ({
  handleChange,
  handleDelete,
  allowedSizes,
  currentSize,
  showSizeSelector = true,
}) => {
  const sizeButtons = [
    {
      size: BlockSize.SINGLE,
      icon: <SingleBlockIcon />,
      label: "Switch to 1x1 grid",
    },
    {
      size: BlockSize.DOUBLE,
      icon: <DoubleBlockIcon />,
      label: "Switch to 2x1 grid",
    },
    {
      size: BlockSize.TXT,
      icon: <SingleBlockIcon />,
      label: "Switch to 2x2 grid",
    },
    {
      size: BlockSize.FXT,
      icon: <DoubleBlockIcon />,
      label: "Switch to 4x4 grid",
    },
  ];

  return (
    <div className="absolute bottom-[-18px] flex items-center gap-1 self-center rounded-[24px] bg-zinc-900 px-2 py-1 shadow-[0_2px_4px_rgba(0,0,0,.04)]">
      {showSizeSelector &&
        sizeButtons
          .filter(({ size }) => allowedSizes.includes(size)) // Updated filter logic
          .map(({ size, icon, label }) => (
            <div
              key={size}
              className={`cursor-pointer rounded-sm p-2 transition duration-200 ease-in-out hover:bg-zinc-700 ${size === currentSize ? "bg-zinc-700" : "bg-zinc-900"}`}
              aria-label={label}
              onClick={async () => await handleChange(size)}
              title={label}
            >
              {icon}
            </div>
          ))}

      {showSizeSelector && (
        <Separator
          orientation="vertical"
          className="mx-1 h-[20px] justify-center text-white"
        />
      )}

      <Button
        size="icon"
        variant="link"
        aria-label="Delete block"
        onClick={async () => await handleDelete()}
      >
        <LuTrash className="text-white no-underline" />
      </Button>
    </div>
  );
};
