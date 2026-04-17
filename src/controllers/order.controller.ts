import { FastifyReply, FastifyRequest } from "fastify";
import * as orderService from "../services/order.service.js";
import { createOrderSchema, verifyPaymentSchema } from "../validation/order.validation.js";

export const createOrderHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Zod Validation
    const validatedData = createOrderSchema.parse(req.body);

    if (!req.user?.userId) {
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    const result = await orderService.initiateRazorpayOrder(
      req.user.userId,
      validatedData.productId,
      validatedData.amount
    );

    return reply.code(201).send({
      success: true,
      statusCode: 201,
      message: "Order initiated",
      ...result
    });
  } catch (error: any) {
    return reply.code(error.name === "ZodError" ? 400 : 500).send({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

export const verifyPaymentHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);

    const updatedOrder = await orderService.verifyRazorpayPayment(
      validatedData.razorpay_order_id,
      validatedData.razorpay_payment_id,
      validatedData.razorpay_signature
    );

    return reply.send({
      success: true,
      statusCode: 200,
      message: "Payment successful",
      order: updatedOrder
    });
  } catch (error: any) {
    return reply.code(400).send({ success: false, message: error.message });
  }
};