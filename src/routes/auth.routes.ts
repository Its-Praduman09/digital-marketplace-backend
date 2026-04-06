import { authenticate } from '@/middleware/auth.middleware.js';
import { FastifyInstance } from 'fastify';
import { loginUserHandler, registerUserHandler } from '../controllers/auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', registerUserHandler);
  app.post('/login', loginUserHandler);
  // Protected Route (Ticket REQUIRED)
  app.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    // request.user is automatically filled by fastify-jwt after verification
    return {
      success: true,
      user: request.user
    };
  });
}