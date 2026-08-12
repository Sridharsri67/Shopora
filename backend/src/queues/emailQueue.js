import { Queue } from 'bullmq';
import redis from '../config/redis.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

let emailQueue = null;

try {
  const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  };
  emailQueue = new Queue('email-queue', { connection });
} catch (err) {
  // Silent fallback
}

export const addOrderConfirmationEmailJob = async (jobData) => {
  try {
    if (emailQueue) {
      await emailQueue.add('ORDER_CONFIRMATION', jobData, { attempts: 3, backoff: 1000 });
      console.log(`[BullMQ Queue] Enqueued ORDER_CONFIRMATION email job for Order #${jobData.orderId}`);
      return { status: 'queued' };
    }
  } catch (err) {
    // Fallback to direct asynchronous execution if Redis queue is offline
  }

  setImmediate(() => {
    sendOrderConfirmationEmail(jobData);
  });
  return { status: 'processed_async' };
};
