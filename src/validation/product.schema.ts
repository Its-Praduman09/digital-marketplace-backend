import { z } from "zod";

export const CreateProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"), // Changed to .number() for better compatibility
  fileUrl: z.string().url("Invalid file URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  category: z.string().default("general"),
  sellerId: z.string().uuid("Invalid Seller ID format").optional(), // Added this line
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;