import { FastifyReply, FastifyRequest } from 'fastify';
import { registerUserService } from '../services/auth.service.js';
import { RegisterInput } from '../validation/auth.schema.js';

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