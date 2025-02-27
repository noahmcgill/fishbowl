"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/shadcn";
import { LuCheck, LuChevronDown, LuPlus } from "react-icons/lu";

interface ColorPickerProps {
  color?: string;
  name?: string;
  onChange?: (color: string) => void;
}

const defaultColors = [
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

export default function ColorPicker({
  color = "#000000",
  onChange,
  name,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = React.useState(color);
  const [customDialogOpen, setCustomDialogOpen] = React.useState(false);
  const [customColor, setCustomColor] = React.useState("#000000");
  const [tempHex, setTempHex] = React.useState("");
  const [colors, setColors] = React.useState<string[]>(defaultColors);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const drawColorPicker = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set actual canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create horizontal rainbow gradient
    const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientH.addColorStop(0, "#ff0000");
    gradientH.addColorStop(1 / 6, "#ffff00");
    gradientH.addColorStop(2 / 6, "#00ff00");
    gradientH.addColorStop(3 / 6, "#00ffff");
    gradientH.addColorStop(4 / 6, "#0000ff");
    gradientH.addColorStop(5 / 6, "#ff00ff");
    gradientH.addColorStop(1, "#ff0000");

    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create vertical white to transparent to black gradient
    const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientV.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    gradientV.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange?.(newColor);

    if (!colors.includes(newColor)) {
      const newDefaultColors = colors;
      setColors([newColor, ...newDefaultColors.slice(0, -1)]);
    }
  };

  const handleCustomColorChange = () => {
    handleColorChange(customColor);
    setCustomDialogOpen(false);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.startsWith("#")
      ? e.target.value
      : `#${e.target.value}`;
    setTempHex(value);

    // Only update if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setCustomColor(value);
    }
  };

  const handleHexInputBlur = () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(tempHex)) {
      setCustomColor(tempHex);
    } else {
      setTempHex(customColor);
    }
  };

  const handleHexInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (/^#[0-9A-Fa-f]{6}$/.test(tempHex)) {
        setCustomColor(tempHex);
      } else {
        setTempHex(customColor);
      }
    }
  };

  React.useEffect(() => {
    if (!customDialogOpen) return;

    // Use requestAnimationFrame to ensure the canvas is ready
    const timer = requestAnimationFrame(() => {
      drawColorPicker();
    });

    return () => cancelAnimationFrame(timer);
  }, [customDialogOpen, drawColorPicker]);

  const getColorAtPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert clicked coordinates to actual canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
    const hex = `#${[pixel[0], pixel[1], pixel[2]]
      .map((x) => {
        const hex = (x ?? "000000").toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")}`;

    setCustomColor(hex);
    setTempHex(hex);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    getColorAtPoint(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      getColorAtPoint(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[220px] justify-between"
            role="combobox"
            aria-label="Select a color"
            name={name}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: selectedColor }}
              />
              <span>{selectedColor}</span>
            </div>
            <LuChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-3">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={cn(
                  "h-8 w-8 rounded-full border border-gray-200 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selectedColor === color && "ring-2 ring-ring ring-offset-2",
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                aria-label={`Select color ${color}`}
              >
                {selectedColor === color && (
                  <LuCheck className="mx-auto h-4 w-4 text-white" />
                )}
              </button>
            ))}
            {/* Custom color button */}
            <button
              className={cn(
                "h-8 w-8 rounded-full border border-gray-200 bg-white ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedColor === customColor &&
                  "ring-2 ring-ring ring-offset-2",
              )}
              onClick={() => {
                setCustomDialogOpen(true);
                setTempHex(customColor);
              }}
              aria-label="Custom color"
            >
              <LuPlus className="mx-auto h-4 w-4 text-gray-600" />
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Choose custom color</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-full border"
                style={{ backgroundColor: customColor }}
              />
              <Input
                value={tempHex}
                onChange={handleHexInputChange}
                onBlur={handleHexInputBlur}
                onKeyDown={handleHexInputKeyDown}
                className="w-[130px]"
                placeholder="#000000"
              />
            </div>
            <canvas
              ref={canvasRef}
              className="h-[200px] w-full cursor-crosshair rounded-lg"
              onClick={getColorAtPoint}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
            <Button onClick={handleCustomColorChange}>Select Color</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
