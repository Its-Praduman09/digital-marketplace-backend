import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt.js";

// 1. Define the Payload to match our JWT utility (UUID string)
type JwtPayload = {
  userId: string;
  email: string;
};

// 2. Extend FastifyRequest so the Controller doesn't show red lines
declare module "fastify" {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

/**
 * AUTHENTICATE MIDDLEWARE
 * Logic: Extracts Bearer token, verifies it, and attaches payload to req.user
 */
export const authenticate = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Bearer token format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({
        success: false,
        statusCode: 401,
        message: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      return reply.code(401).send({
        success: false,
        statusCode: 401,
        message: "Unauthorized - Token missing",
      });
    }

    // Verify using our custom utility
    const decode = verifyToken(token);

    if (!decode) {
      return reply.code(401).send({
        success: false,
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    // Attach decoded data to request object
    req.user = decode as JwtPayload;

    // Continue to the handler
    return;

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return reply.code(500).send({
      success: false,
      statusCode: 500,
      message: "Internal server error during authentication",
    });
  }
};