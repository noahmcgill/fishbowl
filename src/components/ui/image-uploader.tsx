import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LuUpload } from "react-icons/lu";
import { inputFormattedMimeTypes } from "@/lib/constants";
import { ImageUploaderPreview } from "./image-uploader-preview";

interface ImageUploadProps {
  image: string | null;
  isPending: boolean;
  displayRaw?: boolean;
  handleRemoveImage: () => void;
  handleImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
}

export const ImageUploader: React.FC<ImageUploadProps> = ({
  image,
  isPending,
  displayRaw = false,
  handleRemoveImage,
  handleImageChange,
}) => {
  if (isPending) {
    return <>Pending...</>;
  }

  return (
    <Card className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed text-center">
      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
        {image ? (
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-gray-300">
            <ImageUploaderPreview
              useNextTag={!displayRaw}
              src={image}
              width={200}
              height={200}
              priority={true}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
            <img
              src={image}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <LuUpload className="h-full w-full text-zinc-400" />
            <p className="text-gray-600">Add Logo</p>
          </div>
        )}
        <input
          type="file"
          accept={inputFormattedMimeTypes}
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
      {image && (
        <Button
          variant="outline"
          className="fixed"
          onClick={() => handleRemoveImage()}
        >
          Remove
        </Button>
      )}
    </Card>
  );
};
