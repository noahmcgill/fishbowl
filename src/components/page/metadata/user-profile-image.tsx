"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { ImageUploader } from "../../ui/image-uploader";
import {
  type FileUploadInput,
  type FileUploadResponse,
  uploadFileToS3,
} from "@/lib/utils/client/s3";
import { type TRPCError } from "@trpc/server";
import { toast } from "sonner";

interface UserProfileImageProps {
  pageId: string;
  existingImageUrl: string | null;
}

export const UserProfileImage: React.FC<UserProfileImageProps> = ({
  pageId,
  existingImageUrl,
}) => {
  const [image, setImage] = useState<string | null>(existingImageUrl);

  const { mutateAsync: getPresignedUrl } =
    api.page.getPageImageUploadUrl.useMutation();
  const { mutateAsync: uploadFile } = useMutation<
    FileUploadResponse,
    TRPCError,
    FileUploadInput
  >({
    mutationFn: uploadFileToS3,
  });
  const { mutateAsync: updatePageImageUrl } =
    api.page.updatePageImageUrl.useMutation();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Please select an image smaller than 10MB.");
      return;
    }

    const arrayBuffer = await selectedFile.arrayBuffer();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;

      try {
        const { presignedUrl, publicUrl } = await getPresignedUrl({
          pageId,
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          contentLength: selectedFile.size,
        });

        if (!presignedUrl) throw new Error("Failed to get presigned URL.");

        await uploadFile({
          file: new Blob([arrayBuffer], { type: selectedFile.type }),
          presignedUrl,
        });

        await updatePageImageUrl({ pageId, url: publicUrl });

        toast.success("Image uploaded successfully!");

        setImage(imageDataUrl);
      } catch (e) {
        console.log(e);
        toast.error(
          "An error occurred while uploading your image. Please try again.",
        );
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const resetImageState = async () => {
    await updatePageImageUrl({ pageId, url: null });
    setImage(null);
  };

  return (
    <ImageUploader
      image={image}
      handleRemoveImage={resetImageState}
      handleImageChange={handleImageChange}
    />
  );
};
