import { checkDatabaseConnection } from '../config/database.js';
import { checkRedisConnection } from '../config/redis.js';

export const getHealthStatus = async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  const redisStatus = await checkRedisConnection();

  return res.status(200).json({
    status: 'ok',
    service: 'ecommerce-api',
    timestamp: new Date().toISOString(),
    db: dbStatus.connected ? 'connected' : 'disconnected',
    redis: redisStatus.connected ? 'connected' : 'disconnected'
  });
};
