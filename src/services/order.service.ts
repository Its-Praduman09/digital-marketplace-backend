import crypto from "crypto";
import { eq } from "drizzle-orm";
import Razorpay from "razorpay";
import { db } from "../config/db.js";
import { orders } from "../schema/orders.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const initiateRazorpayOrder = async (userId: string, productId: string, amount: number) => {
  const options = {
    amount: amount * 100, // Convert to Paise
    currency: "INR",
    receipt: `receipt_${crypto.randomBytes(4).toString("hex")}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  const [newOrder] = await db.insert(orders).values({
    buyerId: userId,
    productId,
    amount,
    paymentId: razorpayOrder.id,
    status: "pending",
  }).returning();

  return { order: newOrder, razorpayOrderId: razorpayOrder.id };
};

export const verifyRazorpayPayment = async (orderId: string, paymentId: string, signature: string) => {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new Error("Invalid payment signature");
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: "completed",
      paymentId: paymentId
    })
    .where(eq(orders.paymentId, orderId))
    .returning();

  return updatedOrder;
};