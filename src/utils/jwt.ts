import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "Praduman_Digital_Market_Secret_2026";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not defined in .env, using default fallback");
}

// Defining the payload to match your database UUID (string)
export type JwtPayload = {
  userId: string;
  email: string;
};

// Generate Token
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "7d", // Match your .env JWT_EXPIRY
  });
};

// Verify Token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  } catch {
    return null;
  }
};