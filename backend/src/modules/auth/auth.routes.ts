import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { authenticate } from '../../middlewares/auth.middleware';
import { authLimiter } from '../../middlewares/rateLimit.middleware';

const router = Router();
const controller = new AuthController();

router.post('/users', authLimiter, validate(registerSchema), controller.register);
router.post('/token', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/users/me', authenticate, controller.getMe as any);

export default router;
