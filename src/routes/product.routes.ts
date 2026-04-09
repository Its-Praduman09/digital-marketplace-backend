import { FastifyInstance } from 'fastify';
import {
  createProductHandler,
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  updateProductHandler
} from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export async function productRoutes(app: FastifyInstance) {
  // Public Routes
  app.get('/', getProductsHandler);
  app.get('/:id', getProductByIdHandler);

  // Protected Routes
  app.post('/', { preHandler: [authenticate] }, createProductHandler);
  app.patch('/:id', { preHandler: [authenticate] }, updateProductHandler);
  app.delete('/:id', { preHandler: [authenticate] }, deleteProductHandler);
}