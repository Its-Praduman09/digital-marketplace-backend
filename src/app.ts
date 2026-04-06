import 'dotenv/config';
import Fastify from 'fastify';
import { testDbConnection } from './config/db.js';
import { authRoutes } from './routes/auth.routes.js';

const app = Fastify({
  logger: { 
    transport: { 
      target: 'pino-pretty',
      options: {
        colorize: true,
      }
    } 
  },
});
app.register(authRoutes,{prefix:"/api/auth"})
const start = async () => {
  try {
    // 1. Connect to PostgreSQL first (Fail fast if DB is down)
    await testDbConnection();

    // 2. Start Fastify on Port 4000
    const PORT = Number(process.env.PORT) || 4000;
    
    await app.listen({ port: PORT, host: '0.0.0.0' });
    
    // Using app.log is more "Professional" than console.log in Fastify
    app.log.info(`Server live at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();