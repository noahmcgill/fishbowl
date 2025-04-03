import { Button } from "@/components/ui/button";
import { type AllowedBlockSizes, BlockSize } from "./types";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import { SingleBlockIcon } from "@/icons/single-block-icon";
import { DoubleBlockIcon } from "@/icons/double-block-icon";
import { TXTBlockIcon } from "@/icons/txt-block-icon";
import { FXTBlockIcon } from "@/icons/fxt-block-icon";

interface SizeSelectorProps {
  handleChange: (size: BlockSize) => Promise<void>;
  handleDelete: () => Promise<void>;
  allowedSizes: AllowedBlockSizes;
  currentSize: BlockSize;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  handleChange,
  handleDelete,
  allowedSizes,
  currentSize,
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
      icon: <TXTBlockIcon />,
      label: "Switch to 2x2 grid",
    },
    {
      size: BlockSize.FXT,
      icon: <FXTBlockIcon />,
      label: "Switch to 4x4 grid",
    },
  ];

  return (
    <div className="absolute bottom-[-18px] flex items-center gap-1 self-center rounded-[24px] bg-zinc-900 px-2 py-1 shadow-[0_2px_4px_rgba(0,0,0,.04)]">
      {sizeButtons
        .filter(({ size }) => allowedSizes[size])
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

      <Separator
        orientation="vertical"
        className="mx-1 h-[20px] justify-center text-white"
      />

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
