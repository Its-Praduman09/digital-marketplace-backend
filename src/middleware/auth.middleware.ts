import { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // This looks for the 'Authorization: Bearer <TOKEN>' header
    await request.jwtVerify();
  } catch (err) {
    return reply.code(401).send({
      success: false,
      message: "Unauthorized: Please login first"
    });
  }
};