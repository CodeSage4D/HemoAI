import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new AnalyticsController();

router.get('/stats', authenticate, controller.getStats as any);

export default router;
