import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { sendSuccess, sendError } from '../../utils/response';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const aiService = new AIService();

export class AIController {
  async ocrService(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    let tempFilePath = '';
    try {
      const ext = path.extname(req.file.originalname) || '.png';
      const tempDir = os.tmpdir();
      tempFilePath = path.join(tempDir, `${crypto.randomUUID()}${ext}`);

      await fs.promises.writeFile(tempFilePath, req.file.buffer);

      const extracted = await aiService.runOCR(tempFilePath);
      
      return sendSuccess(res, extracted, 'OCR parsing completed successfully');
    } catch (error) {
      next(error);
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          await fs.promises.unlink(tempFilePath);
        } catch (cleanupErr) {
          console.error(`Failed to clean up temp file ${tempFilePath}:`, cleanupErr);
        }
      }
    }
  }

  async finalEngine(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const result = await aiService.runEnsemble(payload);
      return sendSuccess(res, result, 'AI ensemble risk matrices computed');
    } catch (error) {
      next(error);
    }
  }
}
export default AIController;
