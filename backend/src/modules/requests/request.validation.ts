import { z } from 'zod';
import { BloodGroup } from '@prisma/client';

export const createRequestSchema = z.object({
  body: z.object({
    patientId: z.string().uuid('Invalid patient ID format').optional(),
    unitsRequired: z.number().int().positive('Units required must be at least 1'),
    hemoglobinLevel: z.number().positive('Hemoglobin level must be positive'),
    diseaseType: z.string().min(1, 'Disease type or context is required'),
    patientName: z.string().optional(),
    patientAge: z.coerce.number().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
  }),
});

export const routeBestBankSchema = z.object({
  query: z.object({
    hospitalLat: z.coerce.number(),
    hospitalLng: z.coerce.number(),
    requiredUnits: z.coerce.number().int().positive(),
    bloodGroup: z.nativeEnum(BloodGroup),
  }),
});
