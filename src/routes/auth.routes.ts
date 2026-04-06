import { FastifyInstance } from 'fastify';
import { registerUserHandler } from '../controllers/auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', registerUserHandler);
}