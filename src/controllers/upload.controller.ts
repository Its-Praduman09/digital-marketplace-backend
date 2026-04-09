import { FastifyReply, FastifyRequest } from "fastify";
import { uploadToS3 } from "../services/s3.service.js";

export const uploadFileHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. Extract the file from the request (Multipart)
    const data = await req.file();

    if (!data) {
      return reply.code(400).send({ success: false, message: "No file provided" });
    }

    // 2. Convert the stream to a Buffer for S3
    const fileBuffer = await data.toBuffer();

    // 3. Upload to S3 and get the link
    const fileUrl = await uploadToS3(fileBuffer, data.filename, data.mimetype);

    // 4. Return success response with the URL
    return reply.code(200).send({
      success: true,
      statusCode: 200,
      message: "File uploaded successfully",
      url: fileUrl // Copy this URL for your Product Create request
    });
  } catch (error: any) {
    req.log.error(error);
    return reply.code(500).send({ success: false, message: error.message });
  }
};