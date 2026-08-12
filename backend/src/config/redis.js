import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  lazyConnect: true,
  retryStrategy() {
    // Return null to disable auto-reconnecting log spam when local Redis is offline
    return null;
  }
});

let isRedisConnected = false;

redis.on('connect', () => {
  isRedisConnected = true;
  console.log('✅ Redis connected successfully');
});

// Suppress unhandled error log spam when Redis is offline locally
redis.on('error', () => {
  isRedisConnected = false;
});

export const checkRedisConnection = async () => {
  try {
    if (!isRedisConnected) {
      await redis.connect();
    }
    await redis.ping();
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

export default redis;
