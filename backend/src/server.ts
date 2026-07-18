import 'dotenv/config';
import app from './app';
import config from './config';
import logger from './utils/logger';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 JailMeet 2.0 API server running on port ${PORT}`);
  logger.info(`   Environment : ${config.nodeEnv}`);
  logger.info(`   Health check: http://localhost:${PORT}/api/health`);
});

// ─────────────────────────────────────────
// Graceful Shutdown
// ─────────────────────────────────────────
const shutdown = (signal: string) => {
  logger.warn(`${signal} received — shutting down gracefully…`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
