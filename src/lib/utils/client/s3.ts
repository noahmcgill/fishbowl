export interface FileUploadInput {
  file: Blob;
  presignedUrl: string;
}

export interface FileUploadResponse {
  success: boolean;
  message?: string;
}

export const uploadFileToS3 = async ({
  file,
  presignedUrl,
}: FileUploadInput): Promise<FileUploadResponse> => {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Content-Length": `${file.size}`,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("File upload failed");
  }

  return { success: true };
};
