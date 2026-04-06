import { z } from 'zod';

// Define the shape of the registration request
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// Create a Type from the schema for our Controller
export type RegisterInput = z.infer<typeof registerSchema>['body'];

// --- Login Schema (ADD THIS) ---
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"), // Just check if it's not empty
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];