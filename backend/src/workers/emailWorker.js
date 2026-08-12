import { Worker } from 'bullmq';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

export const startEmailWorker = () => {
  try {
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
    };

    const worker = new Worker(
      'email-queue',
      async (job) => {
        if (job.name === 'ORDER_CONFIRMATION') {
          console.log(`[BullMQ Worker Processing] Order #${job.data.orderId}`);
          await sendOrderConfirmationEmail(job.data);
        }
      },
      { connection }
    );

    // Suppress unhandled error log spam when local Redis is offline
    worker.on('error', () => {});

    worker.on('completed', (job) => {
      console.log(`[BullMQ Worker Completed] Job ${job.id} for Order #${job.data.orderId}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[BullMQ Worker Failed] Job ${job?.id}:`, err.message);
    });

    return worker;
  } catch (err) {
    console.log('[BullMQ Worker] Standby mode');
    return null;
  }
};
