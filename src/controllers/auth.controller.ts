import { FastifyReply, FastifyRequest } from 'fastify';
import { loginUserService, registerUserService } from '../services/auth.service.js';
import { LoginInput, RegisterInput } from '../validation/auth.schema.js';

export const registerUserHandler = async (
  request: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) => {
  try {
    // Call the service with the validated body
    const user = await registerUserService(request.body);

    return reply.code(201).send({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error: any) {
    // If service throws an error (e.g. User Exists), catch it here
    return reply.code(400).send({
      success: false,
      message: error.message
    });
  }
};

// --- Login Handler (ADD THIS) ---
export const loginUserHandler = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  try {
    // 1. Verify user with the service
    const user = await loginUserService(request.body);

    // 2. Generate the JWT Token (The Digital Key)
    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email
    });

    // 3. Return success with the token
    return reply.code(200).send({
      success: true,
      message: "Login successful",
      token, // This is what the frontend will save
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    // If password is wrong or user not found, return 401 Unauthorized
    return reply.code(401).send({
      success: false,
      message: error.message || "Invalid email or password"
    });
  }
};