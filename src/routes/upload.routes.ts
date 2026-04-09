import { FastifyInstance } from "fastify";
import { uploadFileHandler } from "../controllers/upload.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export async function uploadRoutes(app: FastifyInstance) {
  // Only authenticated users (Sellers) can upload files to your S3
  app.post("/file", { preHandler: [authenticate] }, uploadFileHandler);
}