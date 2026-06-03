import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import { morganMiddleware } from './config/logger';
import { errorMiddleware } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import aiRoutes from './modules/ai/ai.routes';
import requestRoutes from './modules/requests/request.routes';
import healthRoutes from './modules/health/health.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morganMiddleware);

app.use('/auth', authRoutes);
app.use('/ai', aiRoutes);
app.use('/logistics', requestRoutes);
app.use('/dashboard', analyticsRoutes);
app.use('/', healthRoutes);

app.use(errorMiddleware);

export default app;
