import multipart from '@fastify/multipart';
import 'dotenv/config';
import Fastify from 'fastify';
import { testDbConnection } from './config/db.js';
import { authRoutes } from './routes/auth.routes.js';
import { orderRoutes } from './routes/order.route.js';
import { productRoutes } from './routes/product.routes.js';
import { uploadRoutes } from './routes/upload.routes.js';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  },
});
// 1. Register Plugins
// This MUST be registered before the routes to handle file data
app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // Set limit to 50MB for digital products/videos
  },
});
// Register Routes
app.register(authRoutes, { prefix: "/api/v1/auth" });
app.register(productRoutes, { prefix: "/api/v1/products" });
app.register(uploadRoutes, { prefix: "/api/v1/upload" });
// Registering the order routes
app.register(orderRoutes, { prefix: "/api/v1/orders" });

const start = async () => {
  try {
    // 1. Check Database
    await testDbConnection();

    // 2. Start Server
    const PORT = Number(process.env.PORT) || 4000;
    await app.listen({ port: PORT, host: '0.0.0.0' });

    app.log.info(` Backend Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();