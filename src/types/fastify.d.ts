import '@fastify/multipart';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    // This allows req.user to be used in controllers
    user?: {
      userId: string;
      email: string;
    };
  }
}