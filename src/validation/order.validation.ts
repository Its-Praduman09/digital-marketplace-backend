import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().uuid({ message: "Invalid Product ID format" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
});