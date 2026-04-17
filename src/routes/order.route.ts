import { authenticate } from "@/middleware/auth.middleware.js";
import { FastifyInstance } from "fastify";
import { createOrderHandler, verifyPaymentHandler } from "../controllers/order.controller.js";

export async function orderRoutes(app: FastifyInstance) {
  // Assuming you have an authenticate hook registered
  app.post("/checkout", { preHandler: [authenticate] }, createOrderHandler);
  app.post("/verify", { preHandler: [authenticate] }, verifyPaymentHandler);
}