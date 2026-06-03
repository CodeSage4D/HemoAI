import { Router } from 'express';
import { RequestController } from './request.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createRequestSchema, routeBestBankSchema } from './request.validation';
import { authenticate } from '../../middlewares/auth.middleware';
import { apiLimiter } from '../../middlewares/rateLimit.middleware';

const router = Router();
const controller = new RequestController();

router.post('/requests', authenticate, apiLimiter, validate(createRequestSchema), controller.submitRequest as any);
router.get('/requests', authenticate, controller.getRequests as any);
router.get('/inventory', authenticate, controller.getInventory as any);
router.get('/routing/best-bank', authenticate, validate(routeBestBankSchema), controller.getBestBank as any);

export default router;
