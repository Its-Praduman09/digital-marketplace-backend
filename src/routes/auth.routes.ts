import { FastifyInstance } from 'fastify';
import { loginUserHandler, registerUserHandler } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export async function authRoutes(app: FastifyInstance) {
  // 1. Public Routes (No token required)
  app.post('/register', registerUserHandler);
  app.post('/login', loginUserHandler);

  // 2. Protected Route (Valid Bearer Token required)
  app.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    /** * request.user is populated by the authenticate middleware 
     * using the decoded JWT payload (userId and email).
     */
    return {
      success: true,
      user: request.user
    };
  });
}