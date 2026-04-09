import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (fileBuffer: Buffer, fileName: string, mimetype: string) => {
  // 1. Generate a unique name to avoid overwriting existing files
  const uniqueFileName = `${crypto.randomBytes(8).toString("hex")}-${fileName}`;

  // 2. Robust Folder Logic: Check MimeType OR File Extension
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  // Check if it's an image
  const isImage = mimetype.startsWith("image") || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExtension || '');

  // 3. Determine folder: Images go to 'thumbnails', everything else (ZIP/PDF) to 'source-code'
  const folder = isImage ? "thumbnails" : "source-code";
  const key = `${folder}/${uniqueFileName}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype || 'application/octet-stream', // Fallback for ZIPs
  };

  // 4. Send the command to AWS
  await s3.send(new PutObjectCommand(uploadParams));

  // 5. Return the full S3 URL
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};