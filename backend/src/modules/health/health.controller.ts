import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { AIService } from '../ai/ai.service';
import { sendSuccess, sendError } from '../../utils/response';

const aiService = new AIService();

export class HealthController {
  async health(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$executeRawUnsafe('SELECT 1');
      return sendSuccess(res, {
        status: 'UP',
        database: 'CONNECTED',
        timestamp: new Date(),
      }, 'System is healthy');
    } catch (err: any) {
      return sendError(res, 'Database connection failed', 503, err.message);
    }
  }

  async readiness(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$executeRawUnsafe('SELECT 1');
      
      let aiStatus = 'DOWN';
      try {
        const dummyResult = await aiService.runEnsemble({ raw_text: "test", hb: 12.0 });
        if (dummyResult && dummyResult.status) {
          aiStatus = 'READY';
        }
      } catch (aiErr) {
        aiStatus = `ERROR: ${(aiErr as Error).message}`;
      }

      const memoryUsage = process.memoryUsage();

      return sendSuccess(res, {
        status: 'READY',
        database: 'CONNECTED',
        aiService: aiStatus,
        uptime: process.uptime(),
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
        }
      }, 'System is ready to receive requests');
    } catch (err: any) {
      return sendError(res, 'Readiness probe failed', 503, err.message);
    }
  }
}
export default HealthController;
