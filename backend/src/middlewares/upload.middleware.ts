import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Expected PDF, PNG, or JPEG.'));
    }
  },
});

export const validateFileSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded',
    });
  }

  const buffer = req.file.buffer;
  if (buffer.length < 4) {
    return res.status(400).json({
      status: 'error',
      message: 'File too small to validate signature',
    });
  }

  const hexSignature = buffer.slice(0, 4).toString('hex').toUpperCase();

  const isPDF = hexSignature === '25504446';
  const isPNG = hexSignature === '89504E47';
  const isJPEG = hexSignature.startsWith('FFD8FF');

  if (!isPDF && !isPNG && !isJPEG) {
    logger.warn(`File spoofing detected: Hex signature ${hexSignature} does not match allowed signatures.`);
    return res.status(400).json({
      status: 'error',
      message: 'Security validation failed: File signature spoofing detected.',
    });
  }

  next();
};
