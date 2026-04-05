import { FastifyInstance } from 'fastify';
import { registerUserHandler } from '../controllers/auth.controller.js';
import { registerSchema } from '../validation/auth.schema.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', { 
    schema: { 
      // Access the internal 'body' part of your Zod schema
      body: registerSchema.shape.body 
    } 
  }, registerUserHandler);
}