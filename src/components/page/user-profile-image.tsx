"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { ImageUploader } from "../ui/image-uploader";
import {
  FileUploadInput,
  FileUploadResponse,
  uploadFileToS3,
} from "@/lib/utils/client/s3";
import { TRPCError } from "@trpc/server";
import { toast } from "sonner";

/**
 * To do
 * - update image url in user's profile
 * - clean up UI
 * - image is corrupt in cloudflare
 * - switch to avatar or view only state?
 * - refresh session object when image is uploaded
 * - add to readme about nextjs image config
 */

interface UserProfileImageProps {
  pageId: string;
  existingImageUrl: string | null;
}

export const UserProfileImage: React.FC<UserProfileImageProps> = ({
  pageId,
  existingImageUrl,
}) => {
  const [image, setImage] = useState<string | null>(existingImageUrl);
  const [isImageReset, setIsImageReset] = useState<boolean>(false);

  const { mutateAsync: getPresignedUrl, isPending: isGetPresignedUrlPending } =
    api.page.getPageImageUploadUrl.useMutation();
  const { mutateAsync: uploadFile, isPending: isUploadFilePending } =
    useMutation<FileUploadResponse, TRPCError, FileUploadInput>({
      mutationFn: uploadFileToS3,
    });
  const { mutateAsync: updatePageUrl, isPending: isUpdatePageUrlPending } =
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

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;

      try {
        const { presignedUrl, publicUrl } = await getPresignedUrl({
          pageId,
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          contentLength: imageDataUrl.length,
        });

        if (!presignedUrl) throw new Error("Failed to get presigned URL.");

        await uploadFile({
          file: imageDataUrl,
          presignedUrl,
          contentType: selectedFile.type,
        });

        await updatePageUrl({ url: publicUrl });

        toast.success("Image uploaded successfully!");

        setIsImageReset(true);
        setImage(imageDataUrl);
      } catch (e) {
        console.error(e); // @todo: remove me
        toast.error(
          "An error occurred while uploading your image. Please try again.",
        );
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const resetImageState = () => {
    setImage(null);
    setIsImageReset(true);
  };

  return (
    <ImageUploader
      image={image}
      isPending={
        isGetPresignedUrlPending ||
        isUploadFilePending ||
        isUpdatePageUrlPending
      }
      displayRaw={isImageReset}
      handleRemoveImage={resetImageState}
      handleImageChange={handleImageChange}
    />
  );
};
