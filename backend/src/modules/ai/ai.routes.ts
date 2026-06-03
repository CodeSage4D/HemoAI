import { Router } from 'express';
import { AIController } from './ai.controller';
import { upload, validateFileSignature } from '../../middlewares/upload.middleware';
import { uploadLimiter } from '../../middlewares/rateLimit.middleware';

const router = Router();
const controller = new AIController();

router.post('/ocr-service', uploadLimiter, upload.single('file'), validateFileSignature, controller.ocrService as any);
router.post('/final-engine', controller.finalEngine);

export default router;
