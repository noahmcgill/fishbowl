import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";

const createS3Client = () =>
  new S3Client({
    region: process.env.STORAGE_REGION,
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  });

const globalForS3 = globalThis as unknown as {
  s3: ReturnType<typeof createS3Client> | undefined;
};

export const s3 = globalForS3.s3 ?? createS3Client();

if (env.NODE_ENV !== "production") globalForS3.s3 = s3;
