import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { loginUserService, registerUserService } from '../services/auth.service.js';
import { generateToken } from '../utils/jwt.js';
import { UserLoginSchema, UserRegisterSchema } from '../validation/auth.schema.js';

export const registerUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validateBody = UserRegisterSchema.parse(req.body);
    const user = await registerUserService(validateBody);

    return reply.code(201).send({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return reply.code(400).send({ success: false, errors: error.issues });
    }
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const loginUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validateBody = UserLoginSchema.parse(req.body);
    const user = await loginUserService(validateBody);

    // Generate Token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return reply.code(200).send({
      success: true,
      message: "Login successful",
      user,
      token
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return reply.code(400).send({ success: false, errors: error.issues });
    }
    return reply.code(401).send({ success: false, message: error.message });
  }
};