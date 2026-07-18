/**
 * logger.ts — Utility wrapper around console for structured logging.
 * Extend this with Winston or Pino in a future phase.
 */

const logger = {
  info: (message: string, ...args: unknown[]): void => {
    console.log(`[INFO]  ${new Date().toISOString()} — ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[WARN]  ${new Date().toISOString()} — ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    console.error(`[ERROR] ${new Date().toISOString()} — ${message}`, ...args);
  },
};

export default logger;
