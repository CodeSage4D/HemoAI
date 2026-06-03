import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();
const controller = new HealthController();

router.get('/health', controller.health);
router.get('/readiness', controller.readiness);

export default router;
