import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config';
import errorHandler from './middlewares/errorHandler';
import notFound from './middlewares/notFound';
import { adminRoutes } from './modules/admin';
import { authRouter } from './modules/auth';
import { dashboardRoutes } from './modules/dashboard';
import { officerRoutes } from './modules/officer';
import { paroleRoutes } from './modules/parole';
import { visitorRoutes } from './modules/visitor';
import { notificationRoutes } from './modules/notifications';

const app: Application = express();

// ─────────────────────────────────────────
// Security & Utility Middleware
// ─────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// Health Check Route
// ─────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'JailMeet 2.0 API is running',
  });
});

// ─────────────────────────────────────────
// API Routes (to be registered in future phases)
// ─────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', paroleRoutes);
// app.use('/api/users', usersRouter);

// ─────────────────────────────────────────
// 404 & Global Error Handler (must be LAST)
// ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
