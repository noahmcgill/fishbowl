import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LuTrash, LuUpload } from "react-icons/lu";
import { INPUT_FORMATTED_MIMETYPES } from "@/lib/constants";

interface ImageUploadProps {
  image: string | null;
  handleRemoveImage: () => void;
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
}

export const ImageUploader: React.FC<ImageUploadProps> = ({
  image,
  handleRemoveImage,
  handleImageChange,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative h-32 w-32 md:h-48 md:w-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="cursor-pointer">
        <input
          type="file"
          accept={INPUT_FORMATTED_MIMETYPES}
          className="hidden"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
        <Avatar
          className={`h-full w-full ${image ? "border-0" : "border-2"} ${image ? "" : "border-dashed"} ${image ? "" : "border-zinc-300"}`}
        >
          <AvatarImage src={image || undefined} alt="Uploaded preview" />
          <AvatarFallback className="bg-zinc-50 hover:bg-zinc-100">
            <div className="gap- flex flex-col items-center">
              <LuUpload className="h-6 w-6 text-zinc-600" />
              <p className="font-medium text-zinc-600">Add Avatar</p>
            </div>
          </AvatarFallback>
        </Avatar>
      </label>
      {image && isHovered ? (
        <div className="absolute bottom-0 flex w-full justify-between px-2 md:bottom-4">
          <Button
            variant="outline"
            className="rounded-full bg-white p-2 shadow-md"
            onClick={handleUploadClick}
          >
            <LuUpload className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-white p-2 shadow-md"
            onClick={handleRemoveImage}
          >
            <LuTrash className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
