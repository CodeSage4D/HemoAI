import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { sendSuccess } from '../../utils/response';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await analyticsService.getDashboardStats();
      return sendSuccess(res, stats, 'Dashboard metrics compiled successfully');
    } catch (error) {
      next(error);
    }
  }
}
export default AnalyticsController;
