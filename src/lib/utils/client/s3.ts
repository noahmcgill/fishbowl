export interface FileUploadInput {
  file: string;
  contentType: string;
  presignedUrl: string;
}

export interface FileUploadResponse {
  success: boolean;
  message?: string;
}

export const uploadFileToS3 = async ({
  file,
  presignedUrl,
  contentType,
}: FileUploadInput): Promise<FileUploadResponse> => {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": `${file.length}`,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("File upload failed");
  }

  return { success: true };
};
